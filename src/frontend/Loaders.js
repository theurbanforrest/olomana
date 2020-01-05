import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as THEME from '../constants/theme';
import Loader from 'react-loader-spinner';

export const LoaderSmall = (props) => (
	<Loader
		type={this.props.type}
		color="#d8d8d8"
		height={30}
		width={130}
		timeout={3000} //3 secs
	/>
)

export const LoaderFullScreen = (props) => (
	<Container>
		<Row>
			<Col md="12" style={THEME.LOADER_FULL_SCREEN}>
				<Loader
					type={props.type}
					color="#d8d8d8"
					height={60}
					width={260}
					timeout={300000} //300 secs
				/>
			</Col>
		</Row>
	</Container>
)

