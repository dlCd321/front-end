function ViewModeToggle({ viewMode, onChange }) {
    return (
        <div className="segmented-toggle" role="tablist" aria-label="农田视图模式">
            <button
                className={`segment-button ${viewMode === 'status' ? 'active' : ''}`}
                onClick={() => onChange('status')}
                role="tab"
                type="button"
                aria-selected={viewMode === 'status'}
            >
                状态视图
            </button>
            <button
                className={`segment-button ${viewMode === 'irrigation' ? 'active' : ''}`}
                onClick={() => onChange('irrigation')}
                role="tab"
                type="button"
                aria-selected={viewMode === 'irrigation'}
            >
                灌溉处方
            </button>
        </div>
    );
}

export default ViewModeToggle;
