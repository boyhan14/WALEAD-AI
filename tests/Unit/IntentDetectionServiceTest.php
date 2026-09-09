<?php

namespace Tests\Unit;

use App\Services\AI\MockAIProvider;
use App\Services\IntentDetectionService;
use PHPUnit\Framework\TestCase;

class IntentDetectionServiceTest extends TestCase
{
    private IntentDetectionService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new IntentDetectionService(new MockAIProvider);
    }

    public function test_detects_price_inquiry(): void
    {
        $result = $this->service->detect('Berapa harga produk ini?');

        $this->assertSame('price_inquiry', $result['intent']);
        $this->assertGreaterThan(0.5, $result['confidence']);
    }

    public function test_detects_price_inquiry_from_berapa_keyword(): void
    {
        $result = $this->service->detect('ini yang ready berapa ya');

        // "berapa" outranks "ready" because price check runs first
        $this->assertSame('price_inquiry', $result['intent']);
    }

    public function test_detects_checkout_intent(): void
    {
        $result = $this->service->detect('saya mau beli sekarang');

        $this->assertSame('checkout_intent', $result['intent']);
    }

    public function test_detects_checkout_intent_from_checkout_keyword(): void
    {
        $result = $this->service->detect('lanjut checkout dong');

        $this->assertSame('checkout_intent', $result['intent']);
    }

    public function test_detects_availability_inquiry(): void
    {
        $result = $this->service->detect('stok masih ready?');

        $this->assertSame('availability_inquiry', $result['intent']);
    }

    public function test_falls_back_to_ai_provider_for_unknown_message(): void
    {
        $result = $this->service->detect('halo selamat pagi');

        $this->assertArrayHasKey('intent', $result);
        $this->assertArrayHasKey('confidence', $result);
    }

    public function test_is_case_insensitive(): void
    {
        $result = $this->service->detect('HARGA BERAPA?');

        $this->assertSame('price_inquiry', $result['intent']);
    }
}
