const errorMiddleware = (error, req, res, next) => {
  try {
    const status = error.status || 400; // 과제 스펙에 따르면 400으로 반환하란다.
    const message = error.message || "Something went wrong";

    console.error(`StatusCode : ${status}, Message : ${message}`);
    res.status(status).json({ error: message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
