<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Workspace;
use App\Services\LeadScoringService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadScoringServiceTest extends TestCase
{
    use RefreshDatabase;

    private Workspace $workspace;

    private Customer $customer;

    private LeadScoringService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::create(['name' => 'Scoring Workspace']);
        $this->customer = Customer::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'Scoring Customer',
            'phone' => '628123456000',
        ]);
        $this->service = $this->app->make(LeadScoringService::class);
    }

    public function test_first_event_creates_lead_with_score_delta(): void
    {
        $this->service->recordEvent($this->customer, 'product_inquiry');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertNotNull($lead);
        $this->assertSame(20, $lead->score);
        $this->assertSame('COLD', $lead->temperature);
    }

    public function test_score_accumulates_across_events(): void
    {
        $this->service->recordEvent($this->customer, 'product_inquiry');
        $this->service->recordEvent($this->customer, 'price_inquiry');
        $this->service->recordEvent($this->customer, 'checkout_intent');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertSame(65, $lead->score);
        $this->assertSame('HOT', $lead->temperature);
    }

    public function test_very_hot_temperature_at_high_score(): void
    {
        $this->service->recordEvent($this->customer, 'checkout_intent');
        $this->service->recordEvent($this->customer, 'purchase_completed');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertSame(80, $lead->score);
        $this->assertSame('VERY_HOT', $lead->temperature);
    }

    public function test_score_is_capped_at_100(): void
    {
        $this->service->recordEvent($this->customer, 'purchase_completed');
        $this->service->recordEvent($this->customer, 'purchase_completed');
        $this->service->recordEvent($this->customer, 'purchase_completed');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertSame(100, $lead->score);
    }

    public function test_complaint_decreases_score_and_does_not_go_below_zero(): void
    {
        $this->service->recordEvent($this->customer, 'complaint');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertSame(0, $lead->score);
        $this->assertSame('COLD', $lead->temperature);
    }

    public function test_each_event_is_recorded_as_lead_event(): void
    {
        $this->service->recordEvent($this->customer, 'product_inquiry', ['product_id' => 1]);
        $this->service->recordEvent($this->customer, 'complaint');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertDatabaseHas('lead_events', [
            'lead_id' => $lead->id,
            'type' => 'product_inquiry',
            'score_delta' => 20,
        ]);
        $this->assertDatabaseHas('lead_events', [
            'lead_id' => $lead->id,
            'type' => 'complaint',
            'score_delta' => -10,
        ]);
    }

    public function test_score_snapshot_is_created_per_event(): void
    {
        $this->service->recordEvent($this->customer, 'product_inquiry');
        $this->service->recordEvent($this->customer, 'checkout_intent');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertDatabaseHas('lead_scores', [
            'lead_id' => $lead->id,
            'score' => 20,
        ]);
        $this->assertDatabaseHas('lead_scores', [
            'lead_id' => $lead->id,
            'score' => 50,
        ]);
    }

    public function test_unknown_event_type_uses_default_delta(): void
    {
        $this->service->recordEvent($this->customer, 'something_else');

        $lead = Lead::where('customer_id', $this->customer->id)->first();

        $this->assertSame(5, $lead->score);
    }
}
