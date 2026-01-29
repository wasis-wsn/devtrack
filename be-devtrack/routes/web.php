<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Swagger Documentation
Route::get('/api/docs.json', function () {
    $jsonFile = storage_path('api-docs/api-docs.json');
    $yamlFile = storage_path('api-docs/api-docs.yaml');

    if (file_exists($jsonFile)) {
        return response()->file($jsonFile, [
            'Content-Type' => 'application/json',
        ]);
    }

    if (file_exists($yamlFile)) {
        return response()->file($yamlFile, [
            'Content-Type' => 'application/x-yaml',
        ]);
    }

    return response()->json(['error' => 'Documentation file not found'], 404);
})->name('docs.json');

Route::get('/api/documentation', function () {
    return view('swagger');
})->name('api.docs');
