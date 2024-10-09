"use client";
import useFollwerInfo from "@/hooks/userFollowerInfo";
import { FollowerInfo } from "@/lib/types";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollwerInfo(userId, initialState);
  return (
    <span>
      Follwers: <span className="font-semibold">{data.followers}</span>
    </span>
  );
}
