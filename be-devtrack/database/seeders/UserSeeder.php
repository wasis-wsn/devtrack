<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Manager User
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@test.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        // Create Engineer Users
        User::create([
            'name' => 'Engineer User 1',
            'email' => 'engineer1@test.com',
            'password' => Hash::make('password123'),
            'role' => 'engineer',
        ]);

        User::create([
            'name' => 'Engineer User 2',
            'email' => 'engineer2@test.com',
            'password' => Hash::make('password123'),
            'role' => 'engineer',
        ]);
    }
}

