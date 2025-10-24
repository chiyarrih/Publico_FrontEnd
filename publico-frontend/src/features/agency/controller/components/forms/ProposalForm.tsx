"use client"

import { useState } from "react"
import useBudget from "@agency/controller/hooks/useBudget"
import FileUploadBox from "../cards/FileUploadBox"


export default function ProposalForm({ setTab }: { setTab: (e: string) => void }) {
  const { 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    isLoading, 
    files, 
    setFiles,
    addMilestone,
    removeMilestone,
    updateMilestone,
    milestones,
    totalBudget,
    setTotalBudget,
    usePercentageMode,
    setUsePercentageMode,
    calculateTotalPercentage,
    autoDistributeEqually,
    updateBudgetFromPercentage,
    updatePercentageFromBudget
  } = useBudget()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

// Helper function to format today’s date as YYYY-MM-DD
const today = new Date().toISOString().split("T")[0]


  return (
        <div className="w-full p-8 mx-auto bg-white border rounded-2xl border-slate-200/60 shadow-lg">
      <div className="mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Proposal</h2>
            <p className="text-sm text-slate-600">Fill in the details for your project proposal</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("projectName", { required: "Project title is required" })}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-white"
              placeholder="e.g., Riverside Flood Barrier"
            />
            {errors.projectName && <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.projectName.message}
            </p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Department / Office <span className="text-red-500">*</span>
              </label>
              <select
                {...register("department", { required: "Department is required" })}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-white"
              >
                <option value="">Select Department/Office</option>
                
                <optgroup label="Executive & Administrative Services">
                  <option value="City Mayor's Office">City Mayor's Office</option>
                  <option value="City Administrator's Office">City Administrator's Office</option>
                  <option value="Office of the Vice Mayor">Office of the Vice Mayor</option>
                  <option value="Office of the SP Secretary">Office of the SP Secretary</option>
                  <option value="City Legal Office">City Legal Office</option>
                  <option value="Management Information System Office">Management Information System Office</option>
                  <option value="Human Resources Office">Human Resources Office</option>
                  <option value="City Budget Office">City Budget Office</option>
                  <option value="City Information Office">City Information Office</option>
                </optgroup>
                
                <optgroup label="Public Safety & Disaster Management">
                  <option value="City Disaster Risk Reduction & Management Office">City Disaster Risk Reduction & Management Office</option>
                  <option value="Public Order & Safety Office">Public Order & Safety Office</option>
                  <option value="Public Alert Response & Management Center">Public Alert Response & Management Center</option>
                  <option value="PNP">PNP (Philippine National Police)</option>
                  <option value="BFP">BFP (Bureau of Fire Protection)</option>
                  <option value="Red Cross">Red Cross</option>
                  <option value="PANDA Volunteers">PANDA Volunteers</option>
                  <option value="DECORP">DECORP</option>
                </optgroup>
                
                <optgroup label="Health & Social Services">
                  <option value="City Health Office">City Health Office</option>
                  <option value="City Social Welfare & Development Office">City Social Welfare & Development Office</option>
                  <option value="Office for Senior Citizen's Affairs">Office for Senior Citizen's Affairs</option>
                  <option value="City Nutrition Office">City Nutrition Office</option>
                  <option value="City Population Office">City Population Office</option>
                </optgroup>
                
                <optgroup label="Infrastructure & Development">
                  <option value="City Engineering Office">City Engineering Office</option>
                  <option value="City Planning & Development Office">City Planning & Development Office</option>
                  <option value="Waste Management Division">Waste Management Division</option>
                </optgroup>
                
                <optgroup label="Economic Services & Business Development">
                  <option value="City Tourism Office">City Tourism Office</option>
                  <option value="City Agriculture Office">City Agriculture Office</option>
                  <option value="City Veterinary Office">City Veterinary Office</option>
                  <option value="City Market Division">City Market Division</option>
                  <option value="One Stop Business Center">One Stop Business Center</option>
                  <option value="Public Employment Office">Public Employment Office</option>
                  <option value="PAMANA">PAMANA</option>
                </optgroup>
                
                <optgroup label="Financial Management & Revenue">
                  <option value="City Accounting Office">City Accounting Office</option>
                  <option value="City Treasury Office">City Treasury Office</option>
                  <option value="City Assessor's Office">City Assessor's Office</option>
                </optgroup>
                
                <optgroup label="General Services & Support">
                  <option value="City General Services Office">City General Services Office</option>
                  <option value="City Civil Registry Office">City Civil Registry Office</option>
                </optgroup>
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
                <option value="Executive & Administrative Services">Executive & Administrative Services</option>
                <option value="Public Safety & Disaster Management">Public Safety & Disaster Management</option>
                <option value="Health & Social Services">Health & Social Services</option>
                <option value="Infrastructure & Development">Infrastructure & Development</option>
                <option value="Economic Services & Business Development">Economic Services & Business Development</option>
                <option value="Financial Management & Revenue">Financial Management & Revenue</option>
                <option value="General Services & Support">General Services & Support</option>
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
                  {...register("amountRequested", { 
                    required: "Estimated budget is required",
                    onChange: (e) => {
                      const value = parseFloat(e.target.value) || 0
                      setTotalBudget(value)
                    }
                  })}
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1,500,000"
                  type="number"
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
            <h3 className="text-sm font-medium text-slate-700">Project Milestones / Phases <span className="text-red-500">*</span></h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={autoDistributeEqually}
                className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1"
                disabled={!totalBudget || milestones.length === 0}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Auto-Distribute
              </button>
              <button
                type="button"
                onClick={addMilestone}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
              >
                + Add Phase
              </button>
            </div>
          </div>

          {/* Budget Distribution Summary */}
          {totalBudget > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Total Project Budget: ₱{totalBudget.toLocaleString()}</div>
                    <div className="text-xs text-slate-600">Distributed across {milestones.length} phase{milestones.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${Math.abs(calculateTotalPercentage() - 100) < 0.1 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {calculateTotalPercentage().toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-600">
                    {Math.abs(calculateTotalPercentage() - 100) < 0.1 ? '✓ Complete' : `${(100 - calculateTotalPercentage()).toFixed(1)}% remaining`}
                  </div>
                </div>
              </div>
            </div>
          )}

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  {/* Budget Percentage */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Budget % <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={milestone.budgetPercentage || 0}
                        onChange={(e) => {
                          const percentage = parseFloat(e.target.value) || 0
                          updateBudgetFromPercentage(milestone.id, percentage)
                        }}
                        className="w-full px-3 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                    </div>
                  </div>

                  {/* Budget Amount (calculated) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Budget Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₱</span>
                      <input
                        value={milestone.budget}
                        onChange={(e) => updatePercentageFromBudget(milestone.id, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        placeholder="Budget"
                        type="number"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {milestone.budgetPercentage ? `${milestone.budgetPercentage.toFixed(1)}% of total budget` : 'Enter percentage or amount'}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="md:col-span-3">
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

        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Proposal
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("proposals")}
            className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Cancel
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}
