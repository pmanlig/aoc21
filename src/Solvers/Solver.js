import './Solver.css';
import React from 'react';
import { DataMap } from '../util';

export default class Solver extends React.Component {
	state = {};
	show = true;
	runcontrols = false;
	running = false;
	asserts = [];

	async asyncSolve(input) {
		try {
			this.solve(input);
		} catch (e) {
			console.log(e);
			this.setState({ error: e });
		}
	}

	componentDidMount() {
		if (this.props.input !== null) {
			this.run(false);
		}
	}

	componentDidUpdate(prev) {
		if (this.props.input !== prev.input && this.props.input !== null) {
			this.run(false);
		}
	}

	run(auto) {
		try {
			if (this.runControls) {
				this.running = auto;
				if (!this.running)
					return;
			}
			if (this.props.input === null)
				return;

			this.setState({ error: null });
			this.asyncSolve(this.props.input);
		} catch (e) {
			console.log(e);
			this.setState({ error: e });
		}
	}

	assert(actual, expect) {
		this.asserts.push({ actual: actual, expected: expect });
	}

	solution = p => {
		if (!this.state.solution) return false;
		let i = 0;
		return <div className="solution-text">
			{this.state.solution.toString().split("\n").map(t => <p key={i++}>{t}</p>)}
		</div>;
	}

	assertions = p => {
		// if (this.assertions.length === 0) return null;
		let i = 0;
		return <div className="tests">
			{this.asserts.map(a => <p key={i++}>Test {i}: {a.actual === a.expected ? `passed` : `failed, expected ${a.expected} but found ${a.actual}`}</p>)}
		</div>;
	}

	render() {
		try {
			return <div className="solver">
				<div className="control">
					{this.props.header}
					{this.runControls && <input type="button" value="Solve" onClick={e => this.run(true)} />}
				</div>
				<div className="result">
					{this.customRender ? this.customRender() :
						(this.state.error ? <div>Error: {this.state.error.toString()}</div> :
							<div>
								<this.assertions />
								<this.solution />
								{this.state.data && <DataMap data={this.state.data} scale={this.state.scale} stylemap={this.state.stylemap} />}
							</div>)}
				</div>
			</div>;
		} catch (e) {
			return <div>Error: {e.toString()}</div>;
		}
	}
}
