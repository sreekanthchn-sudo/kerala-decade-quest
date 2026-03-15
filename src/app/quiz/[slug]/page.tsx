import modulesData from '@/data/decade_records.json';
import type { Module } from '@/types';
import QuizClient from './QuizClient';

const modules = modulesData as Module[];

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <QuizClient slug={slug} />;
}
