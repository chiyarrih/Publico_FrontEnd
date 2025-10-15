"use client"

import { useState } from "react"
import useBudget from "@agency/controller/hooks/useBudget"
import FileUploadBox from "../cards/FileUploadBox"


export default function ProposalForm({ setTab }: { setTab: (e: string) => void }) {
  const { register, handleSubmit, errors, onSubmit, isLoading, files, setFiles,addMilestone,removeMilestone,updateMilestone,milestones } = useBudget()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

// Helper function to format today’s date as YYYY-MM-DD
const today = new Date().toISOString().split("T")[0]


  return (
        <div className="w-full p-6 mx-auto bg-white border rounded-xl border-slate-200 shadow-sm">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Create New Proposal</h2>
        <p className="mt-1 text-sm text-slate-500">Fill in the details for your project proposal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("projectName", { required: "Project title is required" })}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Riverside Flood Barrier"
            />
            {errors.projectName && <p className="mt-1.5 text-xs text-red-600">{errors.projectName.message}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                {...register("department", { required: "Department is required" })}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select Department</option>
                <option value="Department of Health">Department of Health</option>
                <option value="Department of Education">Department of Education</option>
                <option value="Department of Public Works and Highways">Department of Public Works and Highways</option>
              </select>
              {errors.department && <p className="mt-1.5 text-xs text-red-600">{errors.department.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select Category</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-600">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estimated Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Estimated Budget <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₱</span>
                <input
                  {...register("amountRequested", { required: "Estimated budget is required" })}
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1,500,000"
                />
              </div>
              {errors.amountRequested && (
                <p className="mt-1.5 text-xs text-red-600">{errors.amountRequested.message}</p>
              )}
            </div>

           {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("startDate", {
                required: "Start date is required",
                onChange: (e) => {
                  const selected = e.target.value
                  setStartDate(selected)
                  // Reset endDate if it's before or same as startDate
                  if (endDate && endDate <= selected) {
                    setEndDate("")
                  }
                },
              })}
              min={today} // disable past dates
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.startDate && <p className="mt-1.5 text-xs text-red-600">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("endDate", {
                required: "End date is required",
                validate: (value) =>
                  value > startDate || "End date must be after the start date",
                onChange: (e) => setEndDate(e.target.value),
              })}
              min={startDate ? (() => {
                const minDate = new Date(startDate)
                minDate.setDate(minDate.getDate() + 1)
                return minDate.toISOString().split("T")[0]
              })() : today}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.endDate && <p className="mt-1.5 text-xs text-red-600">{errors.endDate.message}</p>}
          </div>

        {/* Objectives - Full Width */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Objectives <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("objectives", { required: "Objectives is required" })}
            className="w-full min-h-[150px] rounded-lg border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white"
            placeholder="Describe the objectives and expected outcomes for your project in detail..."
          />
          {errors.objectives && (
            <p className="mt-1.5 text-xs text-red-600">{errors.objectives.message}</p>
          )}
        </div>

        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Supporting Documents</h3>
          <FileUploadBox files={files} setFiles={setFiles} />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Project Milestones</h3>
            <button
              type="button"
              onClick={addMilestone}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
            >
              + Add Milestone
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Milestone {index + 1}</span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Milestone Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      placeholder="Milestone title"
                    />
                  </div>

                 {/* Target Date */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Target Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={milestone.targetDate}
                      min={
                        index > 0 && milestones[index - 1].targetDate
                          ? milestones[index - 1].targetDate // require date after previous milestone
                          : new Date().toISOString().split("T")[0] // for the first milestone: today or later
                      }
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        const today = new Date().toISOString().split("T")[0];

                        // 1️⃣ Disallow past dates for first milestone
                        if (index === 0 && selectedDate < today) {
                          alert("The first milestone cannot have a past date.");
                          return;
                        }

                        // 2️⃣ Disallow earlier dates than previous milestone
                        if (index > 0) {
                          const prevDate = milestones[index - 1].targetDate;
                          if (prevDate && selectedDate <= prevDate) {
                            alert(`Milestone ${index + 1} must be after Milestone ${index}.`);
                            return;
                          }
                        }

                        updateMilestone(milestone.id, "targetDate", selectedDate);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                  </div>
                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₱</span>
                      <input
                        value={milestone.budget}
                        onChange={(e) => updateMilestone(milestone.id, "budget", e.target.value)}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        placeholder="Budget"
                      />
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Deliverables <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={milestone.deliverables}
                      onChange={(e) => updateMilestone(milestone.id, "deliverables", e.target.value)}
                      className="min-h-[70px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white"
                      placeholder="Describe the deliverables for this milestone..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Submitting..." : "Submit Proposal"}
          </button>
          <button
            type="button"
            onClick={() => setTab("proposals")}
            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
          >
            Cancel
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}
