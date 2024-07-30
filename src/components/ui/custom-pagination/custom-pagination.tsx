import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function CustomPagination({
  start,
  limit,
  metadata,
  onPageChange,
}: {
  start: number;
  limit: number;
  metadata?: Meta;
  onPageChange: any;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            style={{ cursor: 'pointer' }}
            onClick={() => onPageChange(start - limit)}
            tabIndex={start === 1 ? -1 : undefined}
            className={start === 1 ? 'pointer-events-none opacity-50' : undefined} // Put 0 if we use boolean MonthlyNote
          />
        </PaginationItem>
        {/* Les liens pour les numéros de page si nécessaire */}
        <PaginationItem>
          {metadata ? (
            <PaginationNext
              style={{ cursor: 'pointer' }}
              onClick={() => onPageChange(start + limit)}
              tabIndex={start === metadata.total - 1 ? -1 : undefined}
              className={
                start === metadata.total - 1 || start === metadata.total - 2 // Put start === metadata.total - 2 || start === metadata.total - 1 if we use boolean MonthlyNote
                  ? 'pointer-events-none opacity-50'
                  : undefined
              }
            />
          ) : null}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
