import { Pagination as BsPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <BsPagination className="justify-content-center">
            <BsPagination.First
                disabled={currentPage === 0}
                onClick={() => onPageChange(0)}
            />
            <BsPagination.Prev
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            />

            {startPage > 0 && (
                <>
                    <BsPagination.Item onClick={() => onPageChange(0)}>1</BsPagination.Item>
                    {startPage > 1 && <BsPagination.Ellipsis disabled />}
                </>
            )}

            {pages.map(page => (
                <BsPagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </BsPagination.Item>
            ))}

            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <BsPagination.Ellipsis disabled />}
                    <BsPagination.Item onClick={() => onPageChange(totalPages - 1)}>
                        {totalPages}
                    </BsPagination.Item>
                </>
            )}

            <BsPagination.Next
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            />
            <BsPagination.Last
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(totalPages - 1)}
            />
        </BsPagination>
    )
}

export default Pagination;