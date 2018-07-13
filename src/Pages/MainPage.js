import React, {Component} from 'react';
import User from '../Components/User'
import {Songs} from '../api'


const SONG_PROGRESS = '.song-progress-bar.progress-bar > .progress';
const SONG_AUDIO = '.song-audio';
const VOLUME = '.volume-progress-bar.progress-bar';
const VOLUME_PROGRESS =  '.volume-progress-bar.progress-bar > .progress';

let AUDIO, PLAYER_BAR, VOLUME_SELECTOR, VOLUME_PROGRESS_SELECTOR = null;

class MainPage extends Component {

	state = {
		songs: [],
		loaded: false,
		currentPlay: '',
		play: false,
		currentTime: 0,
		timer: null,
		volume: 100
	}
	// constructor(props){
	// 	super(props);
	// }
	handleSong = id => {
		if(AUDIO){ 
			clearInterval(this.state.timer);
			if(this.state.play && this.state.currentPlay === id){
				AUDIO.pause();
				this.setState({
					play: false,
					timer: null
				});
			}else{
				this.setState({
					currentPlay: id,
					play: true
				}, () => {
					this.setState({
						timer: this.createTimer(AUDIO, PLAYER_BAR)
					});
					AUDIO.play()
				});
			}
		}
	}
	handlePlay = () => {
		clearInterval(this.state.timer);
		if(AUDIO){
			if(this.state.play && this.state.currentPlay){
				this.setState({
					play: false,
					timer: null
				}, () => AUDIO.pause());
			}else{
				clearInterval(this.state.timer);
				this.setState({
					play: true
				}, () => AUDIO.play());
			}
		}
	}
	changeVolume = event  => {
		if(this.state.currentPlay){
			const volumeBarPosition = event.target.getBoundingClientRect();
			const clientClickPosition = event.clientX
			const positionInside = clientClickPosition - volumeBarPosition.x.toFixed(0);
			const volume = positionInside / VOLUME_SELECTOR.clientWidth;
			VOLUME_PROGRESS_SELECTOR.style.width = positionInside + 'px'; 
			AUDIO.volume = volume;
		}
	}
	setVolume = value => {
			AUDIO.volume = value/100;
			const audioPercent = VOLUME_SELECTOR.clientWidth/100
			VOLUME_PROGRESS_SELECTOR.style.width = audioPercent*value + 'px'; 
	}
	changeProgress = event => {
		const x = event.clientX;
		const width = document.documentElement.clientWidth; //document.body.clientWidth;
		const progress = x / width * 100;
		const audioPercent = AUDIO.duration / 100;
		const val = audioPercent * progress;
		AUDIO.currentTime = val;
		if(this.state.play){
			this.setState({
				currentTime: val
			});
		}else{
			let time = (AUDIO.currentTime / AUDIO.duration) * 100;
			PLAYER_BAR.style.width =  time + "%";
			this.setState({
				currentTime: val
			})
		}
	}
	changeSong = song => () => {
		const currentPlay = this.state.songs[song];
		clearInterval(this.state.timer);
		this.setState({
			currentPlay: currentPlay.id,
			play: true,
			timer: this.createTimer()
		}, () => AUDIO.play());
	} 
	createTimer = () =>
	{
		const interval = setInterval(() => {
			let time = (AUDIO.currentTime / AUDIO.duration) * 100;
			this.setState({
				currentTime: time,
			});
			PLAYER_BAR.style.width =  time + "%";
			console.log('____ ', this.state.currentPlay);
		}, 200);
		return interval;
	}
	componentDidMount(){
		AUDIO = document.querySelector(SONG_AUDIO);
		PLAYER_BAR = document.querySelector(SONG_PROGRESS);
		VOLUME_SELECTOR = document.querySelector(VOLUME);
		VOLUME_PROGRESS_SELECTOR = document.querySelector(VOLUME_PROGRESS);
		this.setVolume(10);
	}
	async componentWillMount(){
		const response = await Songs.getSongs()
		this.setState({
			songs: response.data.songs,
			loaded: true
		});
		
	}
	
	render(){
		const songs = this.state.songs.map(el => { 
			let isActive = el.id === this.state.currentPlay;
			let activeClass = isActive ? 'song-active' : '';
			let songPlayedNow = isActive && this.state.play;
			let buttonClass = songPlayedNow ? 'button-pause' : 'button-play';
			return(
				<div key={el.id} className={"song " + activeClass} >
					<div className="song-name">{el.song_name}</div>
					<div className={"button " + buttonClass} onClick={() => this.handleSong(el.id) }>
					</div>
				</div>
			);
		});
		const currentPlay = this.state.songs.find(el => el.id === this.state.currentPlay);
		const currentIndex = this.state.songs.indexOf(currentPlay);
		const currentPlayName = currentPlay ? currentPlay.song_name : '';
		const playerActive = this.state.currentPlay ? 'player-active' : '';
		const playerButton = !this.state.play ? 'button-play' : 'button-pause';
		return(
			<div className="main-page">
				<User/>
				{songs}
				<div className={"player " + playerActive}>
					<div onClick={this.changeProgress} className="song-progress-bar progress-bar">
						<div className="progress">
						</div>
					</div>
					<div className="player__song-name">
						{currentPlayName}
					</div>
					<div className="player-buttons">
						<div className="player-button button-back"  onClick={this.changeSong(currentIndex - 1)}>
						</div>
						<div className={"player-button " + playerButton} onClick={this.handlePlay}>
						</div>
						<div className="player-button button-next" onClick={this.changeSong(currentIndex + 1)}>
						</div>
					</div>
					<div className="volume-progress-bar progress-bar" onClick={this.changeVolume}>
						<div className="progress"></div>
					</div>
					<audio className ="song-audio" src={ this.state.currentPlay ? "http://127.0.0.1:5000/file/" + this.state.currentPlay : ''} ></audio>
				</div>
			</div>	
		);
	}
}

export default MainPage;