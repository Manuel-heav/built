'use client'

import React, { useEffect, useState } from 'react'
import { Star, GitFork, Calendar, Info, Github } from 'lucide-react'
import axios from 'axios'

interface RepoStats {
  stars: number
  forks: number
  description: string
  lastUpdated: string
  openIssues: number
  language: string
}

export default function GithubStats({ github_repo }: { github_repo: string }) {
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const repoPath = github_repo.replace('https://github.com/', '')
    const [owner, repo] = repoPath.split('/')

    const fetchRepoStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`)
        
        setRepoStats({
          stars: response.data.stargazers_count,
          forks: response.data.forks_count,
          description: response.data.description,
          lastUpdated: new Date(response.data.updated_at).toLocaleDateString(),
          openIssues: response.data.open_issues_count,
          language: response.data.language
        })
      } catch (error) {
        setError(String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchRepoStats()
  }, [github_repo])

  if (error) return (
    <div className="max-w-3xl p-4 bg-[#1c1c21] rounded-lg shadow-sm">
      <div className="flex items-center text-red-500">
        <Info className="w-5 h-5 mr-2" />
        <p>Error: Couldn&apos;t find the data for this repo at the moment 😔</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl p-4 bg-[#1c1c21] rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
        <Github className="mr-2" />
        GitHub Repository Stats
      </h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#25252b] rounded w-3/4"></div>
          <div className="h-4 bg-[#25252b] rounded w-1/2"></div>
          <div className="h-4 bg-[#25252b] rounded w-5/6"></div>
        </div>
      ) : repoStats && (
        <>
          <a href={github_repo} target="_blank" rel="noopener noreferrer" className="text-custom-200 hover:text-white transition-colors duration-200">
            {github_repo}
          </a>
          <p className="mt-2 text-white">{repoStats.description}</p>
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
          </div>
          <div className="mt-4 flex items-center text-custom-200">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            <span>Last updated: {repoStats.lastUpdated}</span>
          </div>
        </>
      )}
    </div>
  )
}