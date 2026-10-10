"use client";

import { useEffect, useState } from "react";
import { Loader2, UserCheck, Users, UserX } from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import {
  createAssignment,
  getAssignments,
  unassignTechnician,
} from "@/services/assignment.service";

import type {
  Assignment,
  CreateAssignmentPayload,
} from "@/types/assignment";
import type { AdminTechnician } from "@/types/dashboard";

interface AssignmentManagerProps {
  workOrderId: string;
}

export default function AssignmentManager({
  workOrderId,
}: AssignmentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [technicians, setTechnicians] = useState<AdminTechnician[]>([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [removingAssignmentId, setRemovingAssignmentId] =
    useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [assignmentData, technicianData] = await Promise.all([
          getAssignments(workOrderId),
          apiFetch<AdminTechnician[]>(endpoints.admin.technicians),
        ]);

        setAssignments(assignmentData);
        setTechnicians(technicianData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load assignment data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [workOrderId]);

  const handleAssign = async () => {
    if (!selectedTechnicianId) {
      toast.error("Please select a technician.");
      return;
    }

    const alreadyAssigned = assignments.some(
      (assignment) =>
        assignment.technicianId === selectedTechnicianId,
    );

    if (alreadyAssigned) {
      toast.error(
        "This technician is already assigned to this work order.",
      );
      return;
    }

    try {
      setIsAssigning(true);

      const payload: CreateAssignmentPayload = {
        technicianId: selectedTechnicianId,
      };

      const assignment = await createAssignment(workOrderId, payload);

      setAssignments((current) => [...current, assignment]);
      setSelectedTechnicianId("");

      toast.success("Technician assigned successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to assign technician.",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    try {
      setRemovingAssignmentId(assignmentId);

      await unassignTechnician(workOrderId, assignmentId);

      setAssignments((current) =>
        current.filter((assignment) => assignment.id !== assignmentId),
      );

      toast.success("Technician unassigned successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to unassign technician.",
      );
    } finally {
      setRemovingAssignmentId(null);
    }
  };

  const getTechnicianName = (technicianId: string) => {
    const technician = technicians.find(
      (item) => item.id === technicianId,
    );

    if (!technician) {
      return technicianId;
    }

    return (
      technician.name ||
      technician.user?.email ||
      technician.employeeCode ||
      technicianId
    );
  };

  const availableTechnicians = technicians.filter(
    (technician) =>
      !assignments.some(
        (assignment) =>
          assignment.technicianId === technician.id,
      ),
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["assignment-skeleton-primary", "assignment-skeleton-secondary"].map(
          (skeletonKey) => (
            <div
              key={skeletonKey}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl"
            />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Assign technician */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Assign Technician
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Select a technician to assign to this work order.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedTechnicianId}
            onChange={(event) =>
              setSelectedTechnicianId(event.target.value)
            }
            disabled={
              isAssigning || availableTechnicians.length === 0
            }
            className="h-10 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 text-xs text-white outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <option value="">
              {availableTechnicians.length === 0
                ? "No technicians available"
                : "Select a technician"}
            </option>

            {availableTechnicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name ||
                  technician.user?.email ||
                  technician.employeeCode ||
                  technician.id}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAssign}
            disabled={isAssigning || !selectedTechnicianId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {isAssigning ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className="size-4" />
                Assign Technician
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current assignments */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <h2 className="text-base font-bold text-white sm:text-lg">
            Current Assignments
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Technicians currently assigned to this work order.
          </p>
        </div>

        {assignments.length === 0 ? (
          <div className="p-8 text-center sm:p-12">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-slate-400 shadow-inner">
              <Users className="size-5 text-teal-400" />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-400 sm:text-sm">
              No technicians are currently assigned to this work order.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Technician
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-200">
                    {getTechnicianName(assignment.technicianId)}
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-500">
                    {assignment.technicianId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnassign(assignment.id)}
                  disabled={removingAssignmentId === assignment.id}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 text-xs font-bold text-rose-300 transition-all hover:bg-rose-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removingAssignmentId === assignment.id ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <UserX className="size-3.5" />
                      Unassign
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}