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