<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Projects",
 *     description="Project management endpoints"
 * )
 */
class ProjectController extends Controller
{
    /**
     * Get all projects
     * 
     * @OA\Get(
     *     path="/api/projects",
     *     operationId="getProjects",
     *     tags={"Projects"},
     *     summary="Get all projects",
     *     description="Get list of projects. Manager sees all, engineer sees only assigned",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Project list",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="start_date", type="string", format="date"),
     *                 @OA\Property(property="end_date", type="string", format="date"),
     *                 @OA\Property(property="manager_id", type="integer")
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'manager') {
            $projects = Project::with('manager')->get();
        } else {
            $projects = Project::whereHas('issues', function($query) use ($user) {
                $query->where('assigned_to', $user->id);
            })->with('manager')->get();
        }

        return response()->json($projects);
    }

    /**
     * Create a new project
     * 
     * @OA\Post(
     *     path="/api/projects",
     *     operationId="createProject",
     *     tags={"Projects"},
     *     summary="Create a new project",
     *     description="Only manager can create project",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","status"},
     *             @OA\Property(property="name", type="string", example="Project Name"),
     *             @OA\Property(property="description", type="string", example="Project description"),
     *             @OA\Property(property="status", type="string", enum={"not_started","in_progress","finished"}, example="in_progress"),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="end_date", type="string", format="date")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Project created",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="project", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Only managers can create projects"
     *     )
     * )
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'manager') {
            return response()->json(['message' => 'Only managers can create projects'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:not_started,in_progress,finished',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $project = Project::create([
            ...$validated,
            'manager_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project,
        ], 201);
    }

    /**
     * Get project details
     * 
     * @OA\Get(
     *     path="/api/projects/{id}",
     *     operationId="getProjectById",
     *     tags={"Projects"},
     *     summary="Get project details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project details with issues",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="start_date", type="string"),
     *             @OA\Property(property="end_date", type="string"),
     *             @OA\Property(property="manager", type="object"),
     *             @OA\Property(property="issues", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found"
     *     )
     * )
     */
    public function show(Request $request, Project $project)
    {
        $user = $request->user();

        if ($user->role === 'engineer' && !$project->issues()->where('assigned_to', $user->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            ...$project->toArray(),
            'manager' => $project->manager,
            'issues' => $project->issues()->with('assignee')->get(),
        ]);
    }

    /**
     * Update project
     * 
     * @OA\Put(
     *     path="/api/projects/{id}",
     *     operationId="updateProject",
     *     tags={"Projects"},
     *     summary="Update project",
     *     description="Only project manager can update",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="status", type="string", enum={"not_started","in_progress","finished"}),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="end_date", type="string", format="date")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project updated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function update(Request $request, Project $project)
    {
        if ($request->user()->role !== 'manager') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:not_started,in_progress,finished',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project,
        ]);
    }

    /**
     * Delete project
     * 
     * @OA\Delete(
     *     path="/api/projects/{id}",
     *     operationId="deleteProject",
     *     tags={"Projects"},
     *     summary="Delete project",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project deleted"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function destroy(Request $request, Project $project)
    {
        if ($request->user()->role !== 'manager') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
