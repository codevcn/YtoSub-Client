type LoadingProps = {
  style?: React.CSSProperties
  dotStyle?: React.CSSProperties
}

export const LoadingDots = ({ style, dotStyle }: LoadingProps) => {
  return (
    <div className="STYLE-sequential-dots-scale" role="status" style={style}>
      <span className="STYLE-sequential-dot" style={dotStyle}></span>
      <span className="STYLE-sequential-dot" style={dotStyle}></span>
      <span className="STYLE-sequential-dot" style={dotStyle}></span>
    </div>
  )
}
