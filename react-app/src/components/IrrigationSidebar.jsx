import { getColorByWater } from '../utils';

const WATER_BANDS = [
    { label: '低需水', range: '0.20 - 0.35 L', description: '土壤水分充足，无需特别处理', water: 0.24 },
    { label: '中低', range: '0.35 - 0.55 L', description: '需少量补水', water: 0.42 },
    { label: '中高', range: '0.55 - 0.70 L', description: '需较多灌溉', water: 0.62 },
    { label: '高需水', range: '0.70 - 0.85 L', description: '严重缺水，优先灌溉', water: 0.82 }
];

function IrrigationSidebar({ selectedPlot, selectedPrescription, irrigationEntries, totalWater }) {
    const maxWater = irrigationEntries[0]?.water || 1;

    return (
        <div className="sidebar-stack">
            <section className="sidebar-card">
                <div className="sidebar-card-header">
                    <div>
                        <p className="eyebrow">Legend</p>
                        <h3>色阶说明</h3>
                    </div>
                </div>
                <div className="water-band-list">
                    {WATER_BANDS.map((band) => {
                        const color = getColorByWater(band.water);
                        return (
                            <div className="water-band-item" key={band.label}>
                                <span
                                    className="water-band-swatch"
                                    style={{ background: color.fill, borderColor: color.stroke }}
                                />
                                <div>
                                    <div className="water-band-title">
                                        {band.label}
                                        <span>{band.range}</span>
                                    </div>
                                    <p>{band.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="sidebar-card">
                <div className="sidebar-card-header">
                    <div>
                        <p className="eyebrow">Ranking</p>
                        <h3>地块灌水量排行</h3>
                    </div>
                </div>
                <div className="ranking-list">
                    {irrigationEntries.map((item) => (
                        <div className="ranking-row" key={item.plotNumber}>
                            <span className="ranking-label">#{item.plotNumber}</span>
                            <div className="ranking-bar-track">
                                <div
                                    className="ranking-bar-fill"
                                    style={{ width: `${(item.water / maxWater) * 100}%` }}
                                />
                            </div>
                            <span className="ranking-value">{item.water.toFixed(2)}L</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="sidebar-card summary">
                <div className="sidebar-card-header">
                    <div>
                        <p className="eyebrow">Summary</p>
                        <h3>今日汇总</h3>
                    </div>
                </div>
                <div className="summary-total">{totalWater.toFixed(2)}L</div>
                <p className="summary-text">
                    {selectedPlot && selectedPrescription
                        ? `当前选中 #${selectedPlot}，建议补水 ${selectedPrescription.water.toFixed(2)}L。`
                        : '选择一个地块查看该处方的优先级与执行建议。'}
                </p>
            </section>
        </div>
    );
}

export default IrrigationSidebar;
