<?php

$controllers = [
    'CustomerController' => <<<'PHP'
<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with('tags')->latest()->paginate(15);
        return Inertia::render('Customers/Index', [
            'customers' => $customers
        ]);
    }

    public function create() { }
    public function store(Request $request) { }
    public function show(Customer $customer) { }
    public function edit(Customer $customer) { }
    public function update(Request $request, Customer $customer) { }
    public function destroy(Customer $customer) { }
}
PHP,

    'ProductController' => <<<'PHP'
<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('variants')->latest()->paginate(15);
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create() { }
    public function store(Request $request) { }
    public function show(Product $product) { }
    public function edit(Product $product) { }
    public function update(Request $request, Product $product) { }
    public function destroy(Product $product) { }
}
PHP,

    'OrderController' => <<<'PHP'
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
PHP,
];

foreach ($controllers as $name => $content) {
    file_put_contents("D:\WALEAD AI\app\Http\Controllers\\$name.php", $content);
    echo "Updated $name\n";
}
