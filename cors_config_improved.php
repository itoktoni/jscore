<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Optimized for Capacitor Android/iOS apps with comprehensive origin support
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Development servers
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080',

        // Capacitor mobile apps (CRITICAL for Android/iOS)
        'capacitor://localhost',
        'ionic://localhost',
        'http://localhost:8100',
        'https://localhost:8100',

        // Production domains
        'https://newcore.nexeratech.co.id',

        // Android file protocol (sometimes needed)
        'file://',
    ],

    'allowed_origins_patterns' => [
        // Allow any localhost port for development
        '/^http:\/\/localhost:\d+$/',
        '/^http:\/\/127\.0\.0\.1:\d+$/',
        // Allow Capacitor schemes
        '/^capacitor:\/\/.*/',
        '/^ionic:\/\/.*/',
    ],

    'allowed_headers' => [
        '*',
        // Explicitly allow common mobile headers
        'Accept',
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-TOKEN',
        'User-Agent',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
    ],

    'exposed_headers' => [
        'Authorization',
        'X-Total-Count',
        'X-Page-Count',
    ],

    'max_age' => 86400, // 24 hours cache for preflight

    'supports_credentials' => true,
];