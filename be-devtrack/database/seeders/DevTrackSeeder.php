<?php

namespace Database\Seeders;

use App\Models\Issue;
use App\Models\Project;
use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DevTrackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Managers
        $manager = User::firstOrCreate(
            ['email' => 'manager@test.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password123'),
                'role' => 'manager',
            ]
        );

        $manager2 = User::firstOrCreate(
            ['email' => 'manager2@test.com'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('password123'),
                'role' => 'manager',
            ]
        );

        $manager3 = User::firstOrCreate(
            ['email' => 'manager3@test.com'],
            [
                'name' => 'Robert Chen',
                'password' => Hash::make('password123'),
                'role' => 'manager',
            ]
        );

        // Engineers
        $engineer1 = User::firstOrCreate(
            ['email' => 'engineer1@test.com'],
            [
                'name' => 'Engineer User 1',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
            ]
        );

        $engineer2 = User::firstOrCreate(
            ['email' => 'engineer2@test.com'],
            [
                'name' => 'Engineer User 2',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
            ]
        );

        $engineer3 = User::firstOrCreate(
            ['email' => 'engineer3@test.com'],
            [
                'name' => 'Alex Martinez',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
            ]
        );

        $engineer4 = User::firstOrCreate(
            ['email' => 'engineer4@test.com'],
            [
                'name' => 'Emily Watson',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
            ]
        );

        $engineer5 = User::firstOrCreate(
            ['email' => 'engineer5@test.com'],
            [
                'name' => 'David Park',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
            ]
        );

        $projectA = Project::firstOrCreate(
            ['name' => 'DevTrack Core Platform'],
            [
                'description' => 'Core API and authentication for DevTrack.',
                'manager_id' => $manager->id,
                'status' => 'in_progress',
                'start_date' => Carbon::now()->subDays(30)->toDateString(),
                'end_date' => Carbon::now()->addDays(60)->toDateString(),
            ]
        );

        $projectB = Project::firstOrCreate(
            ['name' => 'DevTrack Reporting Module'],
            [
                'description' => 'Reporting and analytics module for managers.',
                'manager_id' => $manager->id,
                'status' => 'not_started',
                'start_date' => Carbon::now()->addDays(7)->toDateString(),
                'end_date' => Carbon::now()->addDays(90)->toDateString(),
            ]
        );

        $projectC = Project::firstOrCreate(
            ['name' => 'Mobile App Development'],
            [
                'description' => 'Native iOS and Android mobile applications.',
                'manager_id' => $manager2->id,
                'status' => 'in_progress',
                'start_date' => Carbon::now()->subDays(60)->toDateString(),
                'end_date' => Carbon::now()->addDays(120)->toDateString(),
            ]
        );

        $projectD = Project::firstOrCreate(
            ['name' => 'Database Performance Optimization'],
            [
                'description' => 'Optimize database queries and indexing for speed.',
                'manager_id' => $manager2->id,
                'status' => 'in_progress',
                'start_date' => Carbon::now()->subDays(15)->toDateString(),
                'end_date' => Carbon::now()->addDays(45)->toDateString(),
            ]
        );

        $projectE = Project::firstOrCreate(
            ['name' => 'Security Audit & Implementation'],
            [
                'description' => 'Conduct security audit and implement fixes.',
                'manager_id' => $manager3->id,
                'status' => 'in_progress',
                'start_date' => Carbon::now()->subDays(20)->toDateString(),
                'end_date' => Carbon::now()->addDays(50)->toDateString(),
            ]
        );

        $projectF = Project::firstOrCreate(
            ['name' => 'CI/CD Pipeline Setup'],
            [
                'description' => 'Implement automated testing and deployment pipeline.',
                'manager_id' => $manager3->id,
                'status' => 'finished',
                'start_date' => Carbon::now()->subDays(90)->toDateString(),
                'end_date' => Carbon::now()->subDays(5)->toDateString(),
            ]
        );

        $issueA1 = Issue::firstOrCreate(
            ['project_id' => $projectA->id, 'title' => 'Login API token bug'],
            [
                'description' => 'Tokens sometimes expire unexpectedly for engineers.',
                'assigned_to' => $engineer1->id,
                'type' => 'bug',
                'status' => 'in_progress',
                'priority' => 2,
            ]
        );

        $issueA2 = Issue::firstOrCreate(
            ['project_id' => $projectA->id, 'title' => 'Add project status filters'],
            [
                'description' => 'Allow managers to filter projects by status.',
                'assigned_to' => $engineer2->id,
                'type' => 'improvement',
                'status' => 'open',
                'priority' => 3,
            ]
        );

        $issueA3 = Issue::firstOrCreate(
            ['project_id' => $projectA->id, 'title' => 'Issue priority validation'],
            [
                'description' => 'Ensure priority stays between 1-5 in API.',
                'assigned_to' => $engineer1->id,
                'type' => 'bug',
                'status' => 'done',
                'priority' => 1,
            ]
        );

        $issueB1 = Issue::firstOrCreate(
            ['project_id' => $projectB->id, 'title' => 'Report export design'],
            [
                'description' => 'Design initial report export structure.',
                'assigned_to' => $engineer2->id,
                'type' => 'improvement',
                'status' => 'open',
                'priority' => 4,
            ]
        );

        // Project C Issues (Mobile App)
        $issueC1 = Issue::firstOrCreate(
            ['project_id' => $projectC->id, 'title' => 'iOS app authentication flow'],
            [
                'description' => 'Implement OAuth2 login for iOS application.',
                'assigned_to' => $engineer3->id,
                'type' => 'improvement',
                'status' => 'in_progress',
                'priority' => 5,
            ]
        );

        $issueC2 = Issue::firstOrCreate(
            ['project_id' => $projectC->id, 'title' => 'Android app offline sync'],
            [
                'description' => 'Implement offline data sync for Android app.',
                'assigned_to' => $engineer4->id,
                'type' => 'improvement',
                'status' => 'open',
                'priority' => 4,
            ]
        );

        $issueC3 = Issue::firstOrCreate(
            ['project_id' => $projectC->id, 'title' => 'Fix push notification lag'],
            [
                'description' => 'Notifications sometimes arrive delayed on mobile.',
                'assigned_to' => $engineer3->id,
                'type' => 'bug',
                'status' => 'in_progress',
                'priority' => 3,
            ]
        );

        // Project D Issues (Database Optimization)
        $issueD1 = Issue::firstOrCreate(
            ['project_id' => $projectD->id, 'title' => 'Analyze slow queries'],
            [
                'description' => 'Profile and identify slow running database queries.',
                'assigned_to' => $engineer5->id,
                'type' => 'improvement',
                'status' => 'done',
                'priority' => 5,
            ]
        );

        $issueD2 = Issue::firstOrCreate(
            ['project_id' => $projectD->id, 'title' => 'Add database indexes'],
            [
                'description' => 'Create optimized indexes for frequently queried fields.',
                'assigned_to' => $engineer5->id,
                'type' => 'improvement',
                'status' => 'in_progress',
                'priority' => 5,
            ]
        );

        // Project E Issues (Security)
        $issueE1 = Issue::firstOrCreate(
            ['project_id' => $projectE->id, 'title' => 'SQL injection vulnerability'],
            [
                'description' => 'Fix potential SQL injection in user search endpoint.',
                'assigned_to' => $engineer1->id,
                'type' => 'bug',
                'status' => 'done',
                'priority' => 5,
            ]
        );

        $issueE2 = Issue::firstOrCreate(
            ['project_id' => $projectE->id, 'title' => 'Implement rate limiting'],
            [
                'description' => 'Add rate limiting to prevent brute force attacks.',
                'assigned_to' => $engineer4->id,
                'type' => 'improvement',
                'status' => 'in_progress',
                'priority' => 4,
            ]
        );

        $issueE3 = Issue::firstOrCreate(
            ['project_id' => $projectE->id, 'title' => 'Add HTTPS enforcement'],
            [
                'description' => 'Enforce HTTPS for all API endpoints.',
                'assigned_to' => $engineer2->id,
                'type' => 'improvement',
                'status' => 'open',
                'priority' => 4,
            ]
        );

        // Project F Issues (CI/CD)
        $issueF1 = Issue::firstOrCreate(
            ['project_id' => $projectF->id, 'title' => 'Setup GitHub Actions workflow'],
            [
                'description' => 'Create automated testing workflow in GitHub Actions.',
                'assigned_to' => $engineer5->id,
                'type' => 'improvement',
                'status' => 'done',
                'priority' => 5,
            ]
        );

        $issueF2 = Issue::firstOrCreate(
            ['project_id' => $projectF->id, 'title' => 'Deploy staging environment'],
            [
                'description' => 'Setup automated deployment to staging.',
                'assigned_to' => $engineer3->id,
                'type' => 'improvement',
                'status' => 'done',
                'priority' => 4,
            ]
        );

        // WorkLogs for Project A
        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueA1->id,
                'user_id' => $engineer1->id,
                'logged_at' => Carbon::now()->subDays(2)->setTime(10, 30)->toDateTimeString(),
            ],
            [
                'hours' => 2.5,
                'description' => 'Investigated token expiry issue and added logs.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueA1->id,
                'user_id' => $engineer1->id,
                'logged_at' => Carbon::now()->subDay()->setTime(14, 15)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Implemented token refresh fix and tests.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueA3->id,
                'user_id' => $engineer1->id,
                'logged_at' => Carbon::now()->subDays(5)->setTime(9, 0)->toDateTimeString(),
            ],
            [
                'hours' => 1.5,
                'description' => 'Added validation rules for priority field.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueA2->id,
                'user_id' => $engineer2->id,
                'logged_at' => Carbon::now()->subDays(3)->setTime(11, 0)->toDateTimeString(),
            ],
            [
                'hours' => 2,
                'description' => 'Drafted UI/UX for project status filters.',
            ]
        );

        // WorkLogs for Project C (Mobile)
        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueC1->id,
                'user_id' => $engineer3->id,
                'logged_at' => Carbon::now()->subDays(4)->setTime(9, 0)->toDateTimeString(),
            ],
            [
                'hours' => 4,
                'description' => 'Researched OAuth2 implementation patterns.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueC1->id,
                'user_id' => $engineer3->id,
                'logged_at' => Carbon::now()->subDays(2)->setTime(10, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3.5,
                'description' => 'Implemented OAuth2 login flow.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueC3->id,
                'user_id' => $engineer3->id,
                'logged_at' => Carbon::now()->subDay()->setTime(13, 30)->toDateTimeString(),
            ],
            [
                'hours' => 2.5,
                'description' => 'Fixed notification queue delay issue.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueC2->id,
                'user_id' => $engineer4->id,
                'logged_at' => Carbon::now()->subDays(3)->setTime(14, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Designed offline sync architecture.',
            ]
        );

        // WorkLogs for Project D (Database)
        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueD1->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDays(8)->setTime(8, 0)->toDateTimeString(),
            ],
            [
                'hours' => 4.5,
                'description' => 'Profiled database queries and identified bottlenecks.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueD1->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDays(6)->setTime(9, 30)->toDateTimeString(),
            ],
            [
                'hours' => 2,
                'description' => 'Created performance report with recommendations.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueD2->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDays(3)->setTime(10, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3.5,
                'description' => 'Created indexes on frequently queried columns.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueD2->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDay()->setTime(11, 0)->toDateTimeString(),
            ],
            [
                'hours' => 2,
                'description' => 'Tested indexes and verified performance improvement.',
            ]
        );

        // WorkLogs for Project E (Security)
        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueE1->id,
                'user_id' => $engineer1->id,
                'logged_at' => Carbon::now()->subDays(10)->setTime(9, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Identified SQL injection vulnerability in search.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueE1->id,
                'user_id' => $engineer1->id,
                'logged_at' => Carbon::now()->subDays(8)->setTime(10, 0)->toDateTimeString(),
            ],
            [
                'hours' => 2.5,
                'description' => 'Implemented parameterized queries and tested fix.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueE2->id,
                'user_id' => $engineer4->id,
                'logged_at' => Carbon::now()->subDays(5)->setTime(14, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Researched rate limiting strategies.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueE2->id,
                'user_id' => $engineer4->id,
                'logged_at' => Carbon::now()->subDays(2)->setTime(15, 0)->toDateTimeString(),
            ],
            [
                'hours' => 2.5,
                'description' => 'Implemented token bucket rate limiting.',
            ]
        );

        // WorkLogs for Project F (CI/CD)
        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueF1->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDays(45)->setTime(10, 0)->toDateTimeString(),
            ],
            [
                'hours' => 5,
                'description' => 'Created GitHub Actions workflow for unit tests.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueF1->id,
                'user_id' => $engineer5->id,
                'logged_at' => Carbon::now()->subDays(42)->setTime(11, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Integrated code coverage and linting checks.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueF2->id,
                'user_id' => $engineer3->id,
                'logged_at' => Carbon::now()->subDays(30)->setTime(9, 0)->toDateTimeString(),
            ],
            [
                'hours' => 4,
                'description' => 'Setup Docker containers for staging.',
            ]
        );

        WorkLog::firstOrCreate(
            [
                'issue_id' => $issueF2->id,
                'user_id' => $engineer3->id,
                'logged_at' => Carbon::now()->subDays(28)->setTime(14, 0)->toDateTimeString(),
            ],
            [
                'hours' => 3,
                'description' => 'Configured automated deployment pipeline.',
            ]
        );
    }
}
