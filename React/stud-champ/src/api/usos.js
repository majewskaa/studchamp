import axios from 'axios'
import auth from '../security/auth'

const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @typedef {{ course_id: string, match: string }} CourseByNameResponseItem
 */

/**
 * @typedef {{ items: CourseByNameResponseItem[], next_page: boolean }} CourseByNameResponse
 */

const usosClient = axios.create({ baseURL: 'https://apps.usos.pw.edu.pl' })

router.get('/oauth/usos', (req, res) => {
    const usosAuthUrl = usosClient + `/services/oauth/request_token?oauth_callback=${encodeURIComponent('http://localhost:5000/oauth/usos-callback')}`;
    res.redirect(usosAuthUrl);
});

router.post('/oauth/usos-callback', async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;

    const response = await axios.post(usosClient + '/services/oauth/access_token', {
        oauth_token,
        oauth_verifier,
    });

    const accessToken = response.data.access_token;

    res.json({ accessToken });
    /** @type {LoginResponse} */
    const data = await response.json()
    localStorage.setItem(TOKENS_KEY, data.jwtToken)
});

/**
 * Get course ids  by name
 * @param {string} name
 * @return {Promise<string[]>}
 */
export function getCourseIdsByName(name) {
  const params = new URLSearchParams()
  params.append('lang', 'pl')
  params.append('name', name)
  params.append('format', 'json')

  return usosClient.post('/services/courses/search', params).then(response => {
    /** @type {CourseByNameResponse} */
    const data = response.data
    return data.items.map(x => x.course_id)
  })
}

/**
 * Get course edition
 * @param {string} courseId
 * @param {string} semester
 * @return {Promise<ApiCourseEdition>}
 */
export function getCourseEdition(courseId, semester) {
  return auth
    .getClient()
    .get(`/usos/course_edition?courseId=${courseId}&semester=${semester}`)
    .then(r => r.data)
}