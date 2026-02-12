type HeaderProps = {
  title?: string;
  rightSlot?: React.ReactNode;
}

export default function Header({
  title,
  rightSlot,
}: HeaderProps) {
  return (
    <header>
      <div>
        { title && (
          <h1 className="text-h2 text-text">
            {title}
          </h1>
        )}
      </div>

      <div>
        {rightSlot}
      </div>
    </header>
  )
}