import './loading-overlay.css'
export const LoadingOverlay = ({ isLoading }) => (
    isLoading ? (
        <div className="loading-overlay">
            <div className="spinner"></div>
        </div>
    ) : null
);