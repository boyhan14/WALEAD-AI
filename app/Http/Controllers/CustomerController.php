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