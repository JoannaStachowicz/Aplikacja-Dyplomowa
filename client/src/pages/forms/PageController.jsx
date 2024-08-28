import "./pageController.scss"

const PageController = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="page_controller">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &lt; Poprzednia
            </button>
            <span>
                Strona {currentPage} z {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Następna &gt;
            </button>
        </div>
    );
};

export { PageController };