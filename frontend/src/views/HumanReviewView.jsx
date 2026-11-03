import React, { useState } from 'react';
import {
  UserCheck,
  Check,
  X,
  MessageSquare,
  Send,
  Eye
} from 'lucide-react';

export default function HumanReviewView({
  qaReviews = [],
  onSelectConversation,
  onReviewSubmit
}) {
  const [reviewsList, setReviewsList] = useState(qaReviews);
  const [activeReviewItem, setActiveReviewItem] = useState(reviewsList[0] || null);
  const [verdict, setVerdict] = useState('Valid Issue');
  const [comments, setComments] = useState('');
  const [adjustedScore, setAdjustedScore] = useState(65);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectReview = (item) => {
    setActiveReviewItem(item);
    setVerdict(item.verdict || 'Valid Issue');
    setComments(item.comments || '');
    setAdjustedScore(item.adjustedScore || 65);
  };

  const handleSubmitReview = async () => {
    if (!activeReviewItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/qa/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: activeReviewItem.id,
          verdict,
          comments,
          adjustedScore,
          reviewer: 'Sarah Chen, QA Lead'
        })
      });
      const updated = await res.json();
      setReviewsList(prev => prev.map(r => r.id === updated.id ? updated : r));
      setActiveReviewItem(updated);
      if (onReviewSubmit) onReviewSubmit(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Human Review Queue
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Adjudicate flagged edge cases, eliminate false positives, and calibrate model confidence.
          </p>
        </div>

        <div className="text-xs font-mono text-[#5A5A5A]">
          {reviewsList.filter(r => r.reviewStatus === 'Pending').length} Pending Audits
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left List */}
        <div className="space-y-2">
          {reviewsList.map((item) => {
            const isSelected = activeReviewItem?.id === item.id;
            const isPending = item.reviewStatus === 'Pending';

            return (
              <div
                key={item.id}
                onClick={() => handleSelectReview(item)}
                className={`p-3 rounded border cursor-pointer transition-colors space-y-1.5 ${
                  isSelected
                    ? 'bg-[#1A1A1A] border-[#383838]'
                    : 'bg-[#141414] border-[#262626] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#F5F5F5] font-semibold">{item.conversationId}</span>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                    isPending ? 'bg-[#3B2D18] text-[#EAB66A]' : 'bg-[#1E2F13] text-[#B8F36B]'
                  }`}>
                    {item.reviewStatus}
                  </span>
                </div>

                <p className="text-xs text-[#D4D4D4] font-medium line-clamp-1">{item.detectedIssue}</p>

                <div className="flex justify-between text-[10px] font-mono text-[#737373]">
                  <span>{item.agentName}</span>
                  <span>AI Conf: {Math.round(item.aiConfidence * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Adjudication Panel (2 cols) */}
        {activeReviewItem && (
          <div className="lg:col-span-2 bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-4">
            <div className="flex items-start justify-between border-b border-[#1F1F1F] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#5A5A5A]">AUDIT {activeReviewItem.id}</span>
                <h2 className="text-sm font-semibold text-[#F5F5F5] mt-0.5">
                  {activeReviewItem.detectedIssue}
                </h2>
                <p className="text-[10px] text-[#737373] mt-0.5">
                  Agent: {activeReviewItem.agentName} • Category: {activeReviewItem.failureCategory}
                </p>
              </div>

              <button
                onClick={() => onSelectConversation({ id: activeReviewItem.conversationId })}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] text-xs font-medium text-[#F5F5F5] transition-colors"
              >
                <Eye className="w-3 h-3 text-[#929292]" />
                <span>Open Transcript</span>
              </button>
            </div>

            {/* Verdict Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[#929292]">Determination</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVerdict('Valid Issue')}
                  className={`py-2 px-3 rounded border text-xs font-medium flex items-center justify-center space-x-2 transition-colors ${
                    verdict === 'Valid Issue'
                      ? 'bg-[#1F1F1F] border-[#383838] text-[#F87171] font-semibold'
                      : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#737373] hover:text-[#D4D4D4]'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>Confirm as Valid Issue</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerdict('False Positive')}
                  className={`py-2 px-3 rounded border text-xs font-medium flex items-center justify-center space-x-2 transition-colors ${
                    verdict === 'False Positive'
                      ? 'bg-[#1F1F1F] border-[#383838] text-[#B8F36B] font-semibold'
                      : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#737373] hover:text-[#D4D4D4]'
                  }`}
                >
                  <X className="w-3 h-3" />
                  <span>Dismiss as False Positive</span>
                </button>
              </div>
            </div>

            {/* Adjusted Score */}
            <div className="space-y-1.5 bg-[#0D0D0D] p-3 rounded border border-[#1F1F1F]">
              <div className="flex justify-between text-xs text-[#929292]">
                <span>Adjusted QA Score</span>
                <span className="font-mono text-[#F5F5F5] font-bold">{adjustedScore}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustedScore}
                onChange={(e) => setAdjustedScore(Number(e.target.value))}
                className="w-full accent-[#B8F36B]"
              />
            </div>

            {/* Reviewer Comments */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[#929292]">Remediation Notes</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Notes for model prompt engineering and threshold adjustments..."
                className="w-full bg-[#0D0D0D] border border-[#262626] rounded p-2.5 text-xs text-[#F5F5F5] placeholder-[#5A5A5A] focus:outline-none focus:border-[#383838]"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#5A5A5A]">
                {activeReviewItem.reviewedAt ? `Reviewed on ${new Date(activeReviewItem.reviewedAt).toLocaleDateString()}` : 'Awaiting auditor submission'}
              </span>

              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmitting ? 'Recording...' : 'Submit Decision'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
