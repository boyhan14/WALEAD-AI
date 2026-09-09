<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Provider Driver
    |--------------------------------------------------------------------------
    |
    | Determines which AI provider is used for intent detection, lead scoring
    | and response generation. Supported drivers: "mock", "openai", "gemini".
    |
    */

    'driver' => env('AI_PROVIDER', 'gemini'),

    'openai' => [
        'api_key' => env('AI_API_KEY'),
        'model' => env('AI_MODEL', 'gpt-4o-mini'),
        'base_url' => env('AI_BASE_URL', 'https://api.openai.com/v1'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY', env('AI_API_KEY')),
        'model' => env('AI_MODEL', 'gemini-3.6-flash'),
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    ],

];
