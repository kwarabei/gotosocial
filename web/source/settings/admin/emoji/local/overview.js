/*
	GoToSocial
	Copyright (C) 2021-2023 GoToSocial Authors admin@gotosocial.org

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

const React = require("react");
const { Link } = require("wouter");

const NewEmojiForm = require("./new-emoji");

const query = require("../../../lib/query");
const { useEmojiByCategory } = require("../category-select");
const Loading = require("../../../components/loading");
const { Error } = require("../../../components/error");

module.exports = function EmojiOverview({ baseUrl }) {
	const {
		data: emoji = [],
		isLoading,
		isError,
		error
	} = query.useListEmojiQuery({ filter: "domain:local" });

	let content = null;

	if (isLoading) {
		content = <Loading />;
	} else if (isError) {
		content = <Error error={error} />;
	} else {
		content = (
			<>
				<EmojiList emoji={emoji} baseUrl={baseUrl} />
				<NewEmojiForm emoji={emoji} />
			</>
		);
	}

	return (
		<>
			<h1>Custom Emoji (local)</h1>
			{content}
		</>
	);
};

function EmojiList({ emoji, baseUrl }) {
	const emojiByCategory = useEmojiByCategory(emoji);

	return (
		<div>
			<h2>Overview</h2>
			<div className="list emoji-list">
				{emoji.length == 0 && "No local emoji yet, add one below"}
				{Object.entries(emojiByCategory).map(([category, entries]) => {
					return <EmojiCategory key={category} category={category} entries={entries} baseUrl={baseUrl} />;
				})}
			</div>
		</div>
	);
}

function EmojiCategory({ category, entries, baseUrl }) {
	return (
		<div className="entry">
			<b>{category}</b>
			<div className="emoji-group">
				{entries.map((e) => {
					return (
						<Link key={e.id} to={`${baseUrl}/${e.id}`}>
							<a>
								<img src={e.url} alt={e.shortcode} title={`:${e.shortcode}:`} />
							</a>
						</Link>
					);
				})}
			</div>
		</div>
	);
}