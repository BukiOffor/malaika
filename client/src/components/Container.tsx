'use client'
interface Props {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: Props) {
  return (
    <>
      <div className={`px-3 md:px-8 xl:px-16 ${className}`}>
        {children}
      </div>
    </>
  );
}
