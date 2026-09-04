<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['customer', 'items', 'payments'])->latest()->paginate(15);
        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function create() { }
    public function store(Request $request) { }
    public function show(Order $order) { }
    public function edit(Order $order) { }
    public function update(Request $request, Order $order) { }
    public function destroy(Order $order) { }
}