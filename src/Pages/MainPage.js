import React, {Component} from 'react';
import {Songs} from '../api'

class MainPage extends Component {
	state = {
		songs: [],
		loaded: false,
		currentPlay: '',
		play: false,
		currentTime: 0,
		audio: null,
		playerBar: null,
		timer: null
	}
	handleSong = (id) => {
		const audio = document.querySelector('.song-audio');
		const playerBar = document.querySelector('.player__progress-bar .progress');
		if(audio){ 
			if(this.state.play && this.state.currentPlay === id){
				audio.pause();
				clearInterval(this.state.timer);
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
						timer: this.createTimer(audio, playerBar)
					});
					audio.play()
				});
			}
		}
	}
	handlePlay = () => {
		const audio = document.querySelector('.song-audio');
		if(audio){
			if(this.state.play && this.state.currentPlay){
				this.setState({
					play: false
				}, () => audio.pause());
			}else{
				this.setState({
					play: true
				}, () => audio.play());
			}
		}
	}
	changeProgrees = (e) => {
		let audio = document.querySelector('.song-audio');
		const playerBar = document.querySelector('.player__progress-bar .progress');
		const x = e.clientX;
		const width = document.documentElement.clientWidth; //document.body.clientWidth;
		const progress = x / width * 100;
		const audioPercent = audio.duration / 100;
		const val = audioPercent * progress;
		audio.currentTime = val;
		if(this.state.play){
			this.setState({
				timer: this.createTimer(audio, playerBar)
			});
		}else{
			let time = (audio.currentTime / audio.duration) * 100;
			playerBar.style.width =  time + "%";
			this.setState({
				currentTime: val
			})
		}
	}
	changeSong = (song) => {
		const audio = document.querySelector('.song-audio');
		const currentPlay = this.state.songs[song]
		this.setState({
			currentPlay: currentPlay.id,
			play: true,
			currentTime: 0,
		}, () => audio.play());
	} 
	createTimer = (audio, playerBar) => setInterval(() => {
		let time = (audio.currentTime / audio.duration) * 100;
			this.setState({
					currentTime: time,
			});
			playerBar.style.width =  time + "%";
		}, 200);
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
		const progressBarStatus = currentPlay ? 'player__progress-bar-active' : '';
		const playerButton = !this.state.play ? 'button-play' : 'button-pause';
		return(
			<div className="main-page">
				{songs}
				<div className={"player " + playerActive}>
					<div onClick={(e) => this.changeProgrees(e)} className={"player__progress-bar " + progressBarStatus}>
						<div className="progress">
						</div>
					</div>
					<div className="player__song-name">
						{currentPlayName}
					</div>
					<div className="player-buttons">
						<div className="player-button button-back"  onClick={() => this.changeSong(currentIndex - 1)}>
						</div>
						<div className={"player-button " + playerButton} onClick={this.handlePlay}>
						</div>
						<div className="player-button button-next" onClick={() => this.changeSong(currentIndex + 1)}>
						</div>
					</div>
					<audio className ="song-audio" src={ this.state.currentPlay ? "http://127.0.0.1:5000/file/" + this.state.currentPlay : ''} ></audio>
				</div>
			</div>	
		);
	}
}

export default MainPage;