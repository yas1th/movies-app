function Movie({
    id,
    poster,
    title,
    handleClick
}) {
    return (
        <div data-title={title} onClick={handleClick} id={id}>
            <img src={poster} alt={title} />
            <p>{title}</p>
        </div>
    )
}

export default Movie;