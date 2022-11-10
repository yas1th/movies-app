import './styles.css';
import {useState, useEffect} from "react"
import { MOVIES_LIST } from '../../MockData';
import Movie from '../../Components/Movie';
import createDBInstance from '../../db';
import { DB_NAME, DB_STORE_NAME, FILM_INDUSTRY_ENUM, NETWORK_DELAY_MS, VERSION } from '../../global.constants';

const dbInstance = createDBInstance(DB_NAME, DB_STORE_NAME, VERSION);
const selectedMovieIdsMap = {}

function Movies() {

    const [listOfMovies, setListOfMovies] = useState([])
    const [listOfHollywoodMovies, setListOfHollywoodMovies] = useState([])
    const [listOfBollywoodMovies, setListOfBollywoodMovies] = useState([])
    const [listOfSelectedMovies, setListedOfSelectedMovies] = useState([])

    const fetchListOfMovies = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(MOVIES_LIST)
            }, NETWORK_DELAY_MS)
        })
    }

    const fetchListOfSelectedMovies =  () => {
        dbInstance.init((initRes) => {
            setListedOfSelectedMovies(initRes || [])
        })
    }   

    const handleMovieSelection = (evt) => {
        const curSelMovieTitle = evt.currentTarget.dataset.title;
        const selMoviedId = evt.currentTarget.id;
        console.log('selected movie is', curSelMovieTitle)
        if(!selectedMovieIdsMap[selMoviedId]) {
            // Insert the record only if the movie is not yet selected to exclude duplicates
            selectedMovieIdsMap[selMoviedId] = true;
            setListedOfSelectedMovies(listOfSelectedMovies.concat(curSelMovieTitle))
            dbInstance.insert('movieTitle', curSelMovieTitle);
        }
    }

    useEffect(() => {
        fetchListOfMovies().then((movieListResponse) => setListOfMovies(movieListResponse))
        fetchListOfSelectedMovies();
    }, [])

    useEffect(() => {
        setListOfHollywoodMovies(listOfMovies.filter(movieInfo => movieInfo.filmIndustry === FILM_INDUSTRY_ENUM.HOLLYWOOD))
        setListOfBollywoodMovies(listOfMovies.filter(movieInfo => movieInfo.filmIndustry === FILM_INDUSTRY_ENUM.BOLLYWOOD))
    }, [listOfMovies])

    return(
        <div className="movies-container">
            <div className="selected-movies">
                <h3>List of Selected Movies</h3>
                {listOfSelectedMovies.length && listOfSelectedMovies.map((title, index) => {
                    return (
                        <li key={index}>{title}</li>
                    )
                })}
            </div>
            <div className="movies-list">
                <div className='hollywood-movies'>
                    <h3>Hollywood Movies</h3>
                    {listOfHollywoodMovies.length && listOfHollywoodMovies.map((movieInfo) => {
                        let key = `hmovie-${movieInfo.id}`
                        return (
                            <Movie {...movieInfo } handleClick={handleMovieSelection} key={key} id={key}/>
                        )
                    })}
                </div>
                <div className='bollywood-movies'>
                    <h3>Bollywood Movies</h3>
                    {listOfBollywoodMovies.length && listOfBollywoodMovies.map((movieInfo) => {
                        let key = `bmovie-${movieInfo.id}`
                        return (
                            <Movie {...movieInfo } handleClick={handleMovieSelection} key={key} id={key}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Movies