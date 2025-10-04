import useBudget from "@agency/controller/hooks/useBudget";
import FileUploadBox from "../cards/FileUploadBox";

export default function ProposalForm({ setTab }: { setTab: (e: string) => void }) {
  const { register, handleSubmit, errors, onSubmit, isLoading, files, setFiles } = useBudget();

  return (
    <div className="p-4 bg-white border rounded-lg border-slate-200">
      <div className="mb-3 text-sm font-medium text-slate-800">Create New Proposal</div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
        
        {/* Project Title */}
        <label className="col-span-2 text-xs">
          <span className="block mb-1 text-slate-700">Project Title</span>
          <input
            {...register("projectName", { required: "Project title is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
            placeholder="e.g., Riverside Flood Barrier"
          />
          {errors.projectName && <p className="mt-1 text-xs text-red-500">{errors.projectName.message}</p>}
        </label>

        {/* Department */}
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">Department</span>
          <select
            {...register("department", { required: "Department is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
          >
            <option value="">All Departments</option>
            <option value="Department of Health">Department of Health</option>
            <option value="Department of Education">Department of Education</option>
            <option value="Department of Public Works and Highways">Department of Public Works and Highways</option>
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
        </label>

        {/* Category */}
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">Category</span>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
          >
            <option value="">Select Category</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </label>

        {/* Estimated Budget */}
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">Estimated Budget (₱)</span>
          <input
            {...register("amountRequested", { required: "Estimated budget is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
            placeholder="1,500,000"
          />
          {errors.amountRequested && (
            <p className="mt-1 text-xs text-red-500">{errors.amountRequested.message}</p>
          )}
        </label>

        {/* Start Date */}
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">Start Date</span>
          <input
            type="date"
            {...register("startDate", { required: "Start date is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
        </label>

        {/* End Date */}
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">End Date</span>
          <input
            type="date"
            {...register("endDate", { required: "End date is required" })}
            className="w-full px-2 text-sm border rounded h-9 border-slate-300"
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
        </label>

        {/* Objectives */}
        <label className="col-span-2 text-xs">
          <span className="block mb-1 text-slate-700">Objectives</span>
          <textarea
            className="min-h-[90px] w-full rounded border border-slate-300 px-2 py-2 text-sm"
            placeholder="Describe the objectives and expected outcomes…"
          />
        </label>

        {/* File Upload */}
        <div className="col-span-2">
          <FileUploadBox files={files} setFiles={setFiles} />
        </div>

        {/* Buttons */}
        <div className="flex items-center col-span-2 gap-2">
          <button
            type="submit"
            disabled = {isLoading}
            className="px-4 text-sm text-white bg-blue-600 rounded h-9 hover:bg-blue-700"
          >
            {isLoading ? "Loading" : "Submit Proposal"}
          </button>
          <button
            type="button"
            onClick={() => setTab("proposals")}
            className="px-4 text-sm border rounded h-9 border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
