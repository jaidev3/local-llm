const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading News</h3>
        <p className="text-gray-600">
          Fetching and summarizing the latest headlines...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
