<?php

namespace App\Swagger;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="DevTrack API",
 *     version="1.0.0",
 *     description="API untuk Project and Issue Tracking Tool",
 *     @OA\Contact(email="support@devtrack.com"),
 *     @OA\License(name="MIT", url="https://opensource.org/licenses/MIT")
 * )
 * 
 * @OA\Server(url="http://localhost:8000", description="Development Server")
 * @OA\Server(url="https://api.devtrack.com", description="Production Server")
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     description="Login with email and password to get the authentication token",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 *
 * @OA\Get(
 *     path="/api/health",
 *     tags={"Health"},
 *     summary="Health check",
 *     description="Simple health check endpoint for Swagger generator",
 *     @OA\Response(
 *         response=200,
 *         description="OK"
 *     )
 * )
 */
class OpenApi
{
}
