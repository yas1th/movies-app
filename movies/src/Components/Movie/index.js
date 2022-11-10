function Movie({
    id,
    poster,
    title,
    handleClick
}) {
    return (
        <div key={id} data-title={title} onClick={handleClick}>
            <img src={poster} alt={title} />
            <p>{title}</p>
        </div>
    )
}

export default Movie;