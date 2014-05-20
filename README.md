PeerPerks
==================

Encourage peer code review through gamification with perks.

#### Requirements
- [firebase](https://www.firebase.com)
- [npm](https://www.npmjs.org)
- [bower](http://bower.io)
- [grunt](http://gruntjs.com)

#### Setup

First copy `config.dist.json` to `config.json` and update the `API_URL` setting to your Firebase API URL.

```
npm install
bower install
grunt
```

Go to `localhost:3002`.

In Firebase you should populate a `rewards` collection and `perks` collection with something along the following:

##### Rewards
```json
[
	{
		"points" : 3,
		"name" : "Finished on top this week"
	},
	{
		"points" : 2,
		"name" : "Have your pull request merged"
	}
]
```

##### Perks
```json
[
	{
		"points" : 30,
		"name" : "Pick any one task you want to work on"
	},
	{
		"points" : 50,
		"name" : "Hour off early on Friday"
	}
]
```
