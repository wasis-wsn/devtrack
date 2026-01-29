<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\IssueController;
use App\Http\Controllers\Api\WorkLogController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users/engineers', function () {
        return \App\Models\User::where('role', 'engineer')->select('id', 'name', 'email')->get();
    });

    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Issues
    Route::get('/projects/{project}/issues', [IssueController::class, 'index']);
    Route::post('/projects/{project}/issues', [IssueController::class, 'store']);
    Route::get('/issues/{issue}', [IssueController::class, 'show']);
    Route::put('/issues/{issue}', [IssueController::class, 'update']);
    Route::delete('/issues/{issue}', [IssueController::class, 'destroy']);

    // Work Logs
    Route::get('/issues/{issue}/work-logs', [WorkLogController::class, 'index']);
    Route::post('/issues/{issue}/work-logs', [WorkLogController::class, 'store']);
    Route::get('/work-logs/{workLog}', [WorkLogController::class, 'show']);
    Route::put('/work-logs/{workLog}', [WorkLogController::class, 'update']);
    Route::delete('/work-logs/{workLog}', [WorkLogController::class, 'destroy']);

    // Reports
    Route::get('/projects/{project}/report', [ReportController::class, 'projectReport']);
});
