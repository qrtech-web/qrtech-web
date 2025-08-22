// src/components/ProductoSkeleton.jsx
export default function ProductoSkeleton() {
  return (
    <div className="skeleton p-4 flex flex-col gap-4">
      <div className="h-[380px] w-full rounded-xl bg-slate-800/60"/>
      <div className="h-4 w-2/3 bg-slate-800/60 rounded"/>
      <div className="h-5 w-1/3 bg-slate-800/60 rounded"/>
      <div className="h-10 w-full bg-slate-800/60 rounded-xl mt-auto"/>
    </div>
  );
}
