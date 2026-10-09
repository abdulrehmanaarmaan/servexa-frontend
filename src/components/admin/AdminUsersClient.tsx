"use client";

import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Search,
    RefreshCw,
    MoreHorizontal,
    ShieldCheck,
    UserRound,
    Wrench,
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    FileText,
    Users,
    ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { UserRole } from "@/types/auth";
import type { AdminUser } from "@/types/admin-user";

import {
    getAdminUsers,
    updateUserRole,
    updateUserStatus,
} from "@/services/adminUserService";

const PAGE_SIZE = 10;

const roleConfig: Record<
    UserRole,
    {
        label: string;
        icon: typeof ShieldCheck;
    }
> = {
    ADMIN: {
        label: "Admin",
        icon: ShieldCheck,
    },
    CUSTOMER: {
        label: "Customer",
        icon: UserRound,
    },
    TECHNICIAN: {
        label: "Technician",
        icon: Wrench,
    },
};

type StatusMutationPayload = {
    userId: string;
    isActive: boolean;
};

type RoleMutationPayload = {
    userId: string;
    role: Extract<
        UserRole,
        "CUSTOMER" | "TECHNICIAN"
    >;
};

type PendingStatusAction = {
    user: AdminUser;
    nextIsActive: boolean;
};

type PendingRoleAction = {
    user: AdminUser;
    nextRole: Extract<
        UserRole,
        "CUSTOMER" | "TECHNICIAN"
    >;
};

export default function AdminUsersClient() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");

    const [role, setRole] =
        useState<UserRole | "ALL">("ALL");

    const [isActive, setIsActive] =
        useState<boolean | "ALL">("ALL");

    const [page, setPage] = useState(1);

    const [pendingStatusAction, setPendingStatusAction] =
        useState<PendingStatusAction | null>(null);

    const [pendingRoleAction, setPendingRoleAction] =
        useState<PendingRoleAction | null>(null);

    const usersQuery = useQuery({
        queryKey: [
            "admin-users",
            {
                search,
                role,
                isActive,
                page,
                limit: PAGE_SIZE,
            },
        ],

        queryFn: () =>
            getAdminUsers({
                search: search || undefined,

                role:
                    role === "ALL"
                        ? undefined
                        : role,

                isActive:
                    isActive === "ALL"
                        ? undefined
                        : isActive,

                page,
                limit: PAGE_SIZE,
            }),

        placeholderData: (previousData) =>
            previousData,
    });

    const statusMutation = useMutation({
        mutationFn: ({
            userId,
            isActive,
        }: StatusMutationPayload) =>
            updateUserStatus(
                userId,
                isActive,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            setPendingStatusAction(null);

            toast.success(
                "User status updated successfully.",
            );
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update user status.",
            );
        },
    });

    const roleMutation = useMutation({
        mutationFn: ({
            userId,
            role,
        }: RoleMutationPayload) =>
            updateUserRole(userId, role),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            setPendingRoleAction(null);

            toast.success(
                "User role updated successfully.",
            );
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update user role.",
            );
        },
    });

    const users =
        usersQuery.data?.data ?? [];

    const meta =
        usersQuery.data?.meta;

    const totalPages =
        meta?.totalPages ?? 1;

    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleRoleFilterChange = (
        value: string | null,
    ) => {
        if (
            value === null ||
            ![
                "ALL",
                "ADMIN",
                "CUSTOMER",
                "TECHNICIAN",
            ].includes(value)
        ) {
            return;
        }

        setRole(
            value as UserRole | "ALL",
        );

        setPage(1);
    };

    const handleStatusChange = (
        value: string | null,
    ) => {
        if (value === null) {
            return;
        }

        if (value === "ALL") {
            setIsActive("ALL");
        } else if (value === "ACTIVE") {
            setIsActive(true);
        } else if (value === "SUSPENDED") {
            setIsActive(false);
        } else {
            return;
        }

        setPage(1);
    };

    const resetFilters = () => {
        setSearch("");
        setRole("ALL");
        setIsActive("ALL");
        setPage(1);
    };

    const handleStatusAction = () => {
        if (!pendingStatusAction) {
            return;
        }

        statusMutation.mutate({
            userId:
                pendingStatusAction.user.id,
            isActive:
                pendingStatusAction.nextIsActive,
        });
    };

    const handleRoleAction = () => {
        if (!pendingRoleAction) {
            return;
        }

        roleMutation.mutate({
            userId:
                pendingRoleAction.user.id,
            role:
                pendingRoleAction.nextRole,
        });
    };

    const USER_SKELETON_ROWS = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
    ];

    const isInitialLoading =
        usersQuery.isPending;

    return (
        <>
            <div className="space-y-6 text-slate-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-teal-400">
                            <Users className="size-4 sm:size-5" />

                            <span className="text-xs font-semibold tracking-wide sm:text-sm">
                                Access Control
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                            User Management
                        </h1>

                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                            Manage Servexa users,
                            roles, and account
                            status.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() =>
                            usersQuery.refetch()
                        }
                        disabled={
                            usersQuery.isFetching
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] backdrop-blur-xl shadow-lg"
                    >
                        <RefreshCw
                            className={`size-4 text-teal-400 ${
                                usersQuery.isFetching
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh
                    </Button>
                </div>

                <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/10 bg-slate-950/40 px-6 py-4">
                        <CardTitle className="text-sm font-bold tracking-wide text-white uppercase">
                            Filters
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    value={search}
                                    onChange={
                                        handleSearchChange
                                    }
                                    placeholder="Search by email..."
                                    className="h-10 rounded-xl border-white/10 bg-slate-950/60 pl-10 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-teal-400"
                                />
                            </div>

                            <Select
                                value={role}
                                onValueChange={
                                    handleRoleFilterChange
                                }
                            >
                                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>

                                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                                    <SelectItem value="ALL">
                                        All roles
                                    </SelectItem>

                                    <SelectItem value="ADMIN">
                                        Admin
                                    </SelectItem>

                                    <SelectItem value="CUSTOMER">
                                        Customer
                                    </SelectItem>

                                    <SelectItem value="TECHNICIAN">
                                        Technician
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    isActive ===
                                    "ALL"
                                        ? "ALL"
                                        : isActive
                                          ? "ACTIVE"
                                          : "SUSPENDED"
                                }
                                onValueChange={
                                    handleStatusChange
                                }
                            >
                                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>

                                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                                    <SelectItem value="ALL">
                                        All statuses
                                    </SelectItem>

                                    <SelectItem value="ACTIVE">
                                        Active
                                    </SelectItem>

                                    <SelectItem value="SUSPENDED">
                                        Suspended
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="ghost"
                                onClick={
                                    resetFilters
                                }
                                className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {usersQuery.isError && (
                    <Alert
                        variant="destructive"
                        className="rounded-2xl border-red-500/30 bg-red-950/40 text-red-200 backdrop-blur-xl"
                    >
                        <AlertCircle className="size-4 text-red-400" />

                        <AlertTitle className="font-bold">
                            Unable to load users
                        </AlertTitle>

                        <AlertDescription className="text-xs text-red-300">
                            {usersQuery.error instanceof
                            Error
                                ? usersQuery.error.message
                                : "Something went wrong while loading users."}
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="border-b border-white/10 bg-slate-950/60 text-[10px] tracking-wider text-slate-400 uppercase sm:text-xs">
                                    <tr>
                                        <th className="px-6 py-3.5 font-semibold">
                                            User
                                        </th>

                                        <th className="px-6 py-3.5 font-semibold">
                                            Role
                                        </th>

                                        <th className="px-6 py-3.5 font-semibold">
                                            Status
                                        </th>

                                        <th className="px-6 py-3.5 font-semibold">
                                            Created
                                        </th>

                                        <th className="px-6 py-3.5 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/10">
                                    {isInitialLoading ? (
                                        USER_SKELETON_ROWS.map(
                                            (id) => (
                                                <tr
                                                    key={`user-skeleton-${id}`}
                                                    className="transition-colors hover:bg-white/5"
                                                >
                                                    <td className="px-6 py-4">
                                                        <Skeleton className="h-4 w-48 bg-white/10" />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <Skeleton className="h-6 w-24 bg-white/10" />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <Skeleton className="h-6 w-20 bg-white/10" />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <Skeleton className="h-4 w-24 bg-white/10" />
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <Skeleton className="ml-auto h-8 w-8 bg-white/10" />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : users.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                                                    <FileText className="size-6 text-teal-400" />
                                                </div>

                                                <p className="mt-4 text-base font-bold text-white">
                                                    No users
                                                    found
                                                </p>

                                                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                                                    Try
                                                    changing
                                                    your
                                                    search
                                                    or
                                                    filters.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map(
                                            (user) => {
                                                const roleInfo =
                                                    roleConfig[
                                                        user
                                                            .role
                                                    ];

                                                const RoleIcon =
                                                    roleInfo.icon;

                                                const nextRole =
                                                    user.role ===
                                                    "CUSTOMER"
                                                        ? "TECHNICIAN"
                                                        : user.role ===
                                                            "TECHNICIAN"
                                                          ? "CUSTOMER"
                                                          : null;

                                                return (
                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                        className="transition-colors hover:bg-white/5"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-bold text-white">
                                                                    {
                                                                        user.email
                                                                    }
                                                                </p>

                                                                <p className="mt-1 font-mono text-[10px] text-slate-400">
                                                                    ID:{" "}
                                                                    {
                                                                        user.id
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <Badge
                                                                variant="outline"
                                                                className="inline-flex items-center gap-1.5 rounded-full border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                                                            >
                                                                <RoleIcon className="size-3.5 text-teal-400" />

                                                                {
                                                                    roleInfo.label
                                                                }
                                                            </Badge>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <Badge
                                                                variant={
                                                                    user.isActive
                                                                        ? "default"
                                                                        : "destructive"
                                                                }
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                                                                    user.isActive
                                                                        ? "border border-teal-400/30 bg-teal-400/10 text-teal-300"
                                                                        : "border border-red-400/30 bg-red-400/10 text-red-300"
                                                                }`}
                                                            >
                                                                {user.isActive ? (
                                                                    <span className="size-1.5 animate-pulse rounded-full bg-teal-400" />
                                                                ) : (
                                                                    <span className="size-1.5 rounded-full bg-red-400" />
                                                                )}

                                                                {user.isActive
                                                                    ? "Active"
                                                                    : "Suspended"}
                                                            </Badge>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                                            {new Date(
                                                                user.createdAt,
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td className="px-6 py-4 text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    render={
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            aria-label={`Actions for ${user.email}`}
                                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                                                                        >
                                                                            <MoreHorizontal className="size-4" />
                                                                        </Button>
                                                                    }
                                                                />

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl"
                                                                >
                                                                    {nextRole && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                setPendingRoleAction(
                                                                                    {
                                                                                        user,
                                                                                        nextRole,
                                                                                    },
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                roleMutation.isPending
                                                                            }
                                                                            className="flex items-center gap-2 text-xs text-slate-200 focus:bg-teal-500/10 focus:text-teal-300"
                                                                        >
                                                                            <ArrowRightLeft className="size-4 text-teal-400" />

                                                                            Change
                                                                            to{" "}
                                                                            {nextRole ===
                                                                            "TECHNICIAN"
                                                                                ? "Technician"
                                                                                : "Customer"}
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {user.isActive ? (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                setPendingStatusAction(
                                                                                    {
                                                                                        user,
                                                                                        nextIsActive:
                                                                                            false,
                                                                                    },
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                statusMutation.isPending
                                                                            }
                                                                            className="flex items-center gap-2 text-xs text-red-400 focus:bg-red-500/10 focus:text-red-300"
                                                                        >
                                                                            <Ban className="size-4" />

                                                                            Suspend
                                                                            user
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                setPendingStatusAction(
                                                                                    {
                                                                                        user,
                                                                                        nextIsActive:
                                                                                            true,
                                                                                    },
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                statusMutation.isPending
                                                                            }
                                                                            className="flex items-center gap-2 text-xs text-teal-400 focus:bg-teal-500/10 focus:text-teal-300"
                                                                        >
                                                                            <CheckCircle2 className="size-4" />

                                                                            Activate
                                                                            user
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-400 sm:text-sm">
                                Page {page} of{" "}
                                {totalPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        page <= 1 ||
                                        usersQuery.isFetching
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                Math.max(
                                                    1,
                                                    current -
                                                        1,
                                                ),
                                        )
                                    }
                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft className="size-4" />

                                    Previous
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        page >=
                                            totalPages ||
                                        usersQuery.isFetching
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                Math.min(
                                                    totalPages,
                                                    current +
                                                        1,
                                                ),
                                        )
                                    }
                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next

                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* STATUS CONFIRMATION */}

            <AlertDialog
                open={Boolean(
                    pendingStatusAction,
                )}
                onOpenChange={(open) => {
                    if (
                        !open &&
                        !statusMutation.isPending
                    ) {
                        setPendingStatusAction(
                            null,
                        );
                    }
                }}
            >
                <AlertDialogContent className="rounded-2xl border-white/10 bg-slate-900 text-slate-100 shadow-2xl backdrop-blur-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-white">
                            {pendingStatusAction?.nextIsActive
                                ? "Activate this user?"
                                : "Suspend this user?"}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-xs text-slate-400">
                            {pendingStatusAction?.nextIsActive
                                ? `The account for ${pendingStatusAction.user.email} will be activated again.`
                                : `The account for ${pendingStatusAction?.user.email} will be suspended.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel
                            disabled={
                                statusMutation.isPending
                            }
                            className="rounded-xl border-white/10 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleStatusAction();
                            }}
                            disabled={
                                statusMutation.isPending
                            }
                            className="rounded-xl bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400"
                        >
                            {statusMutation.isPending && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}

                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ROLE CONFIRMATION */}

            <AlertDialog
                open={Boolean(
                    pendingRoleAction,
                )}
                onOpenChange={(open) => {
                    if (
                        !open &&
                        !roleMutation.isPending
                    ) {
                        setPendingRoleAction(
                            null,
                        );
                    }
                }}
            >
                <AlertDialogContent className="rounded-2xl border-white/10 bg-slate-900 text-slate-100 shadow-2xl backdrop-blur-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-white">
                            Change user role?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-xs leading-relaxed text-slate-400">
                            {pendingRoleAction && (
                                <>
                                    The role of{" "}
                                    <span className="font-semibold text-slate-200">
                                        {
                                            pendingRoleAction
                                                .user
                                                .email
                                        }
                                    </span>{" "}
                                    will be changed from{" "}
                                    <span className="font-semibold text-slate-200">
                                        {
                                            roleConfig[
                                                pendingRoleAction
                                                    .user
                                                    .role
                                            ].label
                                        }
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-teal-300">
                                        {
                                            roleConfig[
                                                pendingRoleAction
                                                    .nextRole
                                            ].label
                                        }
                                    </span>
                                    .
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel
                            disabled={
                                roleMutation.isPending
                            }
                            className="rounded-xl border-white/10 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleRoleAction();
                            }}
                            disabled={
                                roleMutation.isPending
                            }
                            className="rounded-xl bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400"
                        >
                            {roleMutation.isPending && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}

                            Confirm Change
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}