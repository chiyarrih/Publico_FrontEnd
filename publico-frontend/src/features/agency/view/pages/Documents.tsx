import { Doc } from "@/interfaces/budget";
import Loader from "@agency/controller/components/loaders/Loader";
import useBudget from "@agency/controller/hooks/useBudget";
import { File } from "lucide-react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const Status: React.FC<{ s: Doc["status"] }> = ({ s }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded ${
      s === "Approved"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {s}
  </span>
);

export default function Documents() {
  const [q, setQ] = React.useState("");
  const {  fetchedData, hasMore, loadMore, handleDownload } = useBudget();

  const filtered = fetchedData.filter(
    (d) =>
      d.projectName?.toLowerCase().includes(q.toLowerCase()) ||
      d.department?.toLowerCase().includes(q?.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border rounded-lg border-slate-200">
        <div className="text-lg font-semibold">Document Management</div>
        <div className="flex items-center gap-2 mt-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents..."
            className="w-full px-3 text-sm border rounded h-9 border-slate-300"
          />
          <select className="px-2 text-sm border rounded h-9 border-slate-300">
            <option>All Categories</option>
            <option>Executive & Administrative Services</option>
            <option>Public Safety & Disaster Management</option>
            <option>Health & Social Services</option>
            <option>Infrastructure & Development</option>
            <option>Economic Services & Business Development</option>
            <option>Financial Management & Revenue</option>
            <option>General Services & Support</option>
          </select>
          <select className="px-2 text-sm border rounded h-9 border-slate-300">
            <option>All Departments</option>
            <option>City Mayor's Office</option>
            <option>City Engineering Office</option>
            <option>City Health Office</option>
            <option>City Planning & Development Office</option>
            <option>City Tourism Office</option>
          </select>
          <button className="px-3 text-sm border rounded h-9 border-slate-300">
            ▦
          </button>
        </div>
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        next={loadMore}
        loader={<Loader />}
        dataLength={filtered.length}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, index) => (
            <div
              key={index}
              className="p-4 bg-white border rounded-lg border-slate-200"
            >
              <div className="flex items-center h-24 overflow-hidden text-sm border border-dashed rounded over justfify-center bg-slate-50 border-slate-200 text-slate-400">
                {d.fileUrl?.endsWith(".pdf") ? (
                      <iframe
                        src={d.fileUrl}
                        className="w-full h-full"
                        title="PDF Preview"
                      />
                    ) : (
                      <img
                        src={d.fileUrl}
                        alt="Document Preview"
                        className="object-cover w-full h-full"
                      />
                    )}
              </div>
              <div className="font-medium truncate">{d.projectName}</div>
              <div className="mt-1 text-xs text-slate-500">
                Department: {d.department}
              </div>
              <div className="text-xs text-slate-500">
                Category: {d.category}
              </div>
              <div className="text-xs text-slate-500">
                Uploaded: {d.createdAt}
              </div>
              <div className="mt-2">
                <Status s={d.status} />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Link to={`${d.fileUrl}`}>
                  <button className="text-sm text-blue-600 hover:underline">
                    View
                  </button>
                </Link>
                <button
                  className="text-sm text-slate-600 hover:underline"
                  onClick={() => handleDownload(d.fileUrl)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <div className="flex items-center justify-between p-3 text-xs bg-white border rounded-lg border-slate-200 text-slate-600">
        <span>
          All documents are verified and secured on the blockchain for
          complete transparency.
        </span>
        <Link to={`https://etherscan.io/`}>
          <button className="text-blue-600 hover:underline">
            View on Blockchain Explorer
          </button>
        </Link>
      </div>
    </div>
  );
}
