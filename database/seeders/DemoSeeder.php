<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Conversation;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            $user = User::create([
                'name' => 'Demo User',
                'email' => 'admin@walead.test',
                'password' => bcrypt('password'),
            ]);
        }

        $workspace = Workspace::firstOrCreate(
            ['name' => 'Kopi Senja'],
            ['name' => 'Kopi Senja']
        );

        $user->workspaces()->syncWithoutDetaching([$workspace->id => ['role' => 'OWNER']]);
        $user->update(['current_workspace_id' => $workspace->id]);

        $channel = Channel::firstOrCreate(
            ['workspace_id' => $workspace->id, 'type' => 'WHATSAPP'],
            ['name' => 'Kopi Senja WhatsApp', 'status' => 'ACTIVE']
        );

        // Products
        $p1 = Product::create(['workspace_id' => $workspace->id, 'name' => 'Es Kopi Susu Senja', 'price' => 25000, 'stock' => 100, 'status' => 'ACTIVE']);
        $p2 = Product::create(['workspace_id' => $workspace->id, 'name' => 'Caramel Macchiato', 'price' => 35000, 'stock' => 50, 'status' => 'ACTIVE']);
        $p3 = Product::create(['workspace_id' => $workspace->id, 'name' => 'Croissant Butter', 'price' => 20000, 'stock' => 20, 'status' => 'ACTIVE']);

        // Customers & Data
        for ($i = 1; $i <= 30; $i++) {
            $customer = Customer::create([
                'workspace_id' => $workspace->id,
                'name' => 'Customer '.$i,
                'phone' => '62812345678'.str_pad($i, 2, '0', STR_PAD_LEFT),
                'lifetime_value' => rand(0, 500000),
            ]);

            // Random leads
            if (rand(1, 10) > 4) {
                Lead::create([
                    'workspace_id' => $workspace->id,
                    'customer_id' => $customer->id,
                    'score' => rand(20, 95),
                    'temperature' => ['COLD', 'WARM', 'HOT', 'VERY_HOT'][rand(0, 3)],
                    'intent' => ['product_inquiry', 'checkout_intent', 'complaint'][rand(0, 2)],
                    'estimated_value' => rand(25000, 150000),
                    'status' => 'OPEN',
                    'last_activity_at' => now()->subDays(rand(0, 5)),
                ]);
            }

            // Conversations
            if (rand(1, 10) > 2) {
                $convo = Conversation::create([
                    'workspace_id' => $workspace->id,
                    'channel_id' => $channel->id,
                    'customer_id' => $customer->id,
                    'status' => ['OPEN', 'RESOLVED'][rand(0, 1)],
                    'last_message_at' => now()->subMinutes(rand(1, 600)),
                ]);

                Message::create([
                    'workspace_id' => $workspace->id,
                    'conversation_id' => $convo->id,
                    'sender_customer_id' => $customer->id,
                    'message_type' => 'TEXT',
                    'content' => 'Halo kak, apakah kopi susu ready?',
                    'direction' => 'INBOUND',
                ]);

                if (rand(1, 10) > 5) {
                    Message::create([
                        'workspace_id' => $workspace->id,
                        'conversation_id' => $convo->id,
                        'message_type' => 'TEXT',
                        'content' => 'Ready kak! Silahkan dipesan.',
                        'direction' => 'OUTBOUND',
                    ]);
                }
            }

            // Orders
            if (rand(1, 10) > 6) {
                $order = Order::create([
                    'workspace_id' => $workspace->id,
                    'customer_id' => $customer->id,
                    'order_number' => 'ORD-'.strtoupper(uniqid()),
                    'status' => 'COMPLETED',
                    'total' => 60000,
                ]);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $p1->id,
                    'name' => $p1->name,
                    'price' => $p1->price,
                    'quantity' => 2,
                    'total' => 50000,
                ]);
            }
        }
    }
}
