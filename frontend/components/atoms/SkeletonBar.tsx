const SkeletonBar = ({
  width,
  height,
}: {
  height?: string;
  width?: string;
}) => {
  return (
    <div className="flex justify-between items-center py-1">
      <div
        className=" bg-gray-800 rounded animate-pulse"
        style={{
          width: width ? width : "100%",
          height: height ? height : "16px",
        }}
      ></div>
    </div>
  );
};

export default SkeletonBar;
