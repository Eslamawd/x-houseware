import { Button } from "../components/ui/button";

export default function Pagination({
  currentPage,
  lastPage,
  total,
  onPrev,
  onNext,
  label,
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button onClick={onPrev} disabled={currentPage === 1}>
        Prev
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {lastPage} — Total: {total} {label}
      </span>

      <Button onClick={onNext} disabled={currentPage === lastPage}>
        Next
      </Button>
    </div>
  );
}
