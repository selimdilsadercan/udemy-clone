"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

interface Props {
  value: string;
}

function Preview({ value }: Props) {
  //hydration issue
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return <ReactQuill theme="bubble" value={value} readOnly />;
}

x