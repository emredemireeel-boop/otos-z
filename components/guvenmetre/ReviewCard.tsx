"use client";

import { UserReview } from "@/data/guvenmetre";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ReviewCard({ review }: { review: UserReview }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(review.likes);

    const handleLike = () => {
        if (isLiked) {
            setLikes(prev => prev - 1);
        } else {
            setLikes(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg">
                        {review.userAvatar}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{review.userName}</span>
                            {review.isVerified && (
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            )}
                        </div>
                        <span className="text-xs text-neutral-500">{review.timeAgo}</span>
                    </div>
                </div>

                <div className="flex gap-0.5 bg-neutral-900/50 px-2 py-1 rounded-lg">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i <= review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'fill-neutral-800 text-neutral-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed">
                {review.comment}
            </p>

            <div className="flex items-center gap-4 pt-1">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-orange-500' : 'text-neutral-500 hover:text-white'
                        }`}
                >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                </button>
            </div>
        </div>
    );
}
