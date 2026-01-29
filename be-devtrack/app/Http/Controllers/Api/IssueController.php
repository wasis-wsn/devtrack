<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Issue;
use App\Models\Project;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Issues",
 *     description="Issue management endpoints"
 * )
 */
class IssueController extends Controller
{
    /**
     * Get issues for a project
     * 
     * @OA\Get(
     *     path="/api/projects/{projectId}/issues",
     *     operationId="getIssues",
     *     tags={"Issues"},
     *     summary="Get issues for project",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Issues list",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="type", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="priority", type="integer"),
     *                 @OA\Property(property="assigned_to", type="integer")
     *             )
     *         )
     *     )
     * )
     */
    public function index(Project $project)
    {
        return response()->json($project->issues()->with('assignee')->get());
    }

    /**
     * Create new issue
     * 
     * @OA\Post(
     *     path="/api/projects/{projectId}/issues",
     *     operationId="createIssue",
     *     tags={"Issues"},
     *     summary="Create new issue",
     *     description="Only project manager can create issue",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","type","priority"},
     *             @OA\Property(property="title", type="string", example="Bug in login"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="type", type="string", enum={"bug","improvement"}, example="bug"),
     *             @OA\Property(property="priority", type="integer", minimum=1, maximum=5, example=3),
     *             @OA\Property(property="assigned_to", type="integer", description="User ID to assign")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Issue created"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Only managers can create issues"
     *     )
     * )
     */
    public function store(Request $request, Project $project)
    {
        if ($request->user()->role !== 'manager') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:bug,improvement',
            'priority' => 'required|integer|min:1|max:5',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);

        $issue = $project->issues()->create($validated);

        return response()->json([
            'message' => 'Issue created successfully',
            'issue' => $issue,
        ], 201);
    }

    /**
     * Get issue details
     * 
     * @OA\Get(
     *     path="/api/issues/{id}",
     *     operationId="getIssueById",
     *     tags={"Issues"},
     *     summary="Get issue details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Issue details"
     *     )
     * )
     */
    public function show(Issue $issue)
    {
        // Authorization check
        $user = auth()->user();
        if ($user->role === 'engineer' && $issue->assigned_to !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            ...$issue->toArray(),
            'project' => $issue->project,
            'assignee' => $issue->assignee,
            'work_logs' => $issue->workLogs()->with('user')->get(),
            'total_hours' => $issue->getTotalWorkingHours(),
        ]);
    }

    /**
     * Update issue
     * 
     * @OA\Put(
     *     path="/api/issues/{id}",
     *     operationId="updateIssue",
     *     tags={"Issues"},
     *     summary="Update issue",
     *     description="Manager can update all fields. Assigned engineer can update status and add work logs",
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
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="type", type="string", enum={"bug","improvement"}),
     *             @OA\Property(property="priority", type="integer", minimum=1, maximum=5),
     *             @OA\Property(property="status", type="string", enum={"open","in_progress","done"}),
     *             @OA\Property(property="assigned_to", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Issue updated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function update(Request $request, Issue $issue)
    {
        $user = $request->user();
        $project = $issue->project;

        // Check authorization
        if ($user->role === 'manager') {
            // Any manager can update everything
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'type' => 'sometimes|in:bug,improvement',
                'priority' => 'sometimes|integer|min:1|max:5',
                'status' => 'sometimes|in:open,in_progress,done',
                'assigned_to' => 'nullable|integer|exists:users,id',
            ]);
        } elseif ($user->id === $issue->assigned_to) {
            // Engineer can only update status
            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,done',
            ]);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $issue->update($validated);

        return response()->json([
            'message' => 'Issue updated successfully',
            'issue' => $issue,
        ]);
    }

    /**
     * Delete issue
     * 
     * @OA\Delete(
     *     path="/api/issues/{id}",
     *     operationId="deleteIssue",
     *     tags={"Issues"},
     *     summary="Delete issue",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Issue deleted"
     *     )
     * )
     */
    public function destroy(Request $request, Issue $issue)
    {
        if ($request->user()->id !== $issue->project->manager_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $issue->delete();

        return response()->json(['message' => 'Issue deleted successfully']);
    }
}
