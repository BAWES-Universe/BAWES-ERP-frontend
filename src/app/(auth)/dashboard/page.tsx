'use client';

import React, { useEffect } from 'react';
import { useAuth, usePeople, usePermissions } from '@/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Shield,
  Activity,
  LayoutDashboard,
  UserCheck,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Settings,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

/* ── Metric Card ── */

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  isLoading: boolean;
  coral?: boolean;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
  coral,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={
            coral
              ? 'rounded-md bg-coral-light p-2 text-coral'
              : 'rounded-md bg-primary/10 p-2 text-primary'
          }
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ── Quick Action ── */

interface QuickActionProps {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

function QuickAction({ label, description, icon: Icon, href }: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-colors hover:border-coral/30 hover:bg-coral-light/30">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="rounded-md bg-coral-light p-2 text-coral shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-coral transition-colors shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

/* ── Empty Activity State ── */

function EmptyActivityFeed() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Activity className="h-12 w-12 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Activity will appear here as changes are made
      </p>
    </div>
  );
}

/* ── Activity Skeleton ── */

function ActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 py-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/* ── Main Dashboard Component ── */

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    people,
    isLoading: peopleLoading,
    error: peopleError,
    loadPeople,
  } = usePeople();
  const {
    dashboard,
    isLoading: permissionsLoading,
    error: permissionsError,
    loadDashboard,
  } = usePermissions();

  // Trigger data loading on mount
  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  // usePermissions calls loadDashboard on mount via its own useEffect

  const isLoading = peopleLoading || permissionsLoading;
  const error = peopleError || permissionsError;

  /* ── Welcome greeting based on time of day ── */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.nameEn || 'there';
  const totalRoles = dashboard?.roles?.length ?? 0;
  const recentActivityCount = 0; // placeholder for future activity tracking

  return (
    <div className="space-y-8">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-coral" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {displayName}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your ERP system
        </p>
      </div>

      <Separator />

      {/* ── Error State ── */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadPeople();
                loadDashboard();
              }}
              className="ml-4 shrink-0"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Metric Cards Grid ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total People"
          value={people?.length ?? 0}
          description="Registered individuals in the system"
          icon={Users}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Users"
          value={people?.length ?? 0}
          description="Currently active accounts"
          icon={UserCheck}
          isLoading={isLoading}
          coral
        />
        <MetricCard
          title="Roles Configured"
          value={totalRoles}
          description="Permission groups defined"
          icon={Shield}
          isLoading={isLoading}
        />
        <MetricCard
          title="Recent Activity"
          value={recentActivityCount}
          description="Actions in the last 24 hours"
          icon={Activity}
          isLoading={isLoading}
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Activity Feed */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-coral" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions and changes across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <ActivitySkeleton key={i} />
                ))}
              </div>
            ) : (
              <EmptyActivityFeed />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-coral" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              label="Add Person"
              description="Create a new person record"
              icon={PlusCircle}
              href="/people"
            />
            <QuickAction
              label="Manage Roles"
              description="Configure permissions and roles"
              icon={Shield}
              href="/roles"
            />
            <QuickAction
              label="System Settings"
              description="Update account and app preferences"
              icon={Settings}
              href="/settings"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
