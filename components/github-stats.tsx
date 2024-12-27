"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  GitFork,
  Calendar,
  Info,
  Github,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { RepoStats } from "@/types";

export default function GithubStats({ github_repo }: { github_repo: string }) {
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const repoPath = github_repo.replace("https://github.com/", "");
    const [owner, repo] = repoPath.split("/");

    const fetchRepoStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}`
        );

        setRepoStats({
          stars: response.data.stargazers_count,
          forks: response.data.forks_count,
          description: response.data.description,
          lastUpdated: new Date(response.data.updated_at).toLocaleDateString(),
          openIssues: response.data.open_issues_count,
          language: response.data.language,
          watchers: response.data.watchers_count,
          subscribers: response.data.subscribers_count,
          size: response.data.size,
          network: response.data.network_count,
          createdAt: new Date(response.data.created_at).toLocaleDateString(),
          pushedAt: new Date(response.data.pushed_at).toLocaleDateString(),
          defaultBranch: response.data.default_branch,
          license: response.data.license?.name,
          hasIssues: response.data.has_issues,
          hasProjects: response.data.has_projects,
          hasDownloads: response.data.has_downloads,
          hasWiki: response.data.has_wiki,
          hasPages: response.data.has_pages,
          archived: response.data.archived,
          disabled: response.data.disabled,
          visibility: response.data.visibility,
        });
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchRepoStats();
  }, [github_repo]);

  if (error)
    return (
      <div className="max-w-3xl p-4 bg-[#1c1c21] rounded-lg shadow-sm">
        <div className="flex items-center text-red-500">
          <Info className="w-5 h-5 mr-2" />
          <p>
            Error: Couldn&apos;t find the data for this repo at the moment 😔
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-full p-4 bg-[#1c1c21] rounded-lg shadow-sm">
      <h2 className="md:text-2xl text-xl font-bold mb-4 flex items-center text-white">
        <Github className="mr-2" />
        GitHub Repository Stats
      </h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#25252b] rounded w-3/4"></div>
          <div className="h-4 bg-[#25252b] rounded w-1/2"></div>
          <div className="h-4 bg-[#25252b] rounded w-5/6"></div>
        </div>
      ) : (
        repoStats && (
          <>
            <a
              href={github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-custom-200 hover:text-white transition-colors duration-200 md:text-base text-sm "
            >
              {github_repo}
            </a>
            <p className="md:text-base text-sm mt-2 text-white">
              {repoStats.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center text-custom-200">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                <span>{repoStats.stars.toLocaleString()} stars</span>
              </div>
              <div className="flex items-center text-custom-200">
                <GitFork className="w-5 h-5 mr-2 text-white" />
                <span>{repoStats.forks.toLocaleString()} forks</span>
              </div>
              <div className="flex items-center text-custom-200">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                <span>{repoStats.openIssues.toLocaleString()} open issues</span>
              </div>
              <div className="flex items-center text-custom-200">
                <Eye className="w-5 h-5 mr-2 text-purple-500" />
                <span>{repoStats.watchers.toLocaleString()} watchers</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-custom-200">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              <span>Last updated: {repoStats.lastUpdated}</span>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-4 flex items-center text-custom-200 hover:text-white transition-colors duration-200"
            >
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 mr-2" />
              ) : (
                <ChevronDown className="w-5 h-5 mr-2" />
              )}
              {showAdvanced ? "Hide Advanced Stats" : "Show Advanced Stats"}
            </button>
            {showAdvanced && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-orange-500" />
                    <span>
                      {repoStats.subscribers.toLocaleString()} subscribers
                    </span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-pink-500" />
                    <span>{repoStats.size.toLocaleString()} KB</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-teal-500" />
                    <span>{repoStats.network.toLocaleString()} network</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Calendar className="w-5 h-5 mr-2 text-green-500" />
                    <span>Created at: {repoStats.createdAt}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Calendar className="w-5 h-5 mr-2 text-green-500" />
                    <span>Last pushed at: {repoStats.pushedAt}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Default branch: {repoStats.defaultBranch}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>License: {repoStats.license}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>
                      Has issues: {repoStats.hasIssues ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>
                      Has projects: {repoStats.hasProjects ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>
                      Has downloads: {repoStats.hasDownloads ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>Has wiki: {repoStats.hasWiki ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>Has pages: {repoStats.hasPages ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>Archived: {repoStats.archived ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>Disabled: {repoStats.disabled ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center text-custom-200">
                    <Info className="w-5 h-5 mr-2 text-red-500" />
                    <span>Visibility: {repoStats.visibility}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
